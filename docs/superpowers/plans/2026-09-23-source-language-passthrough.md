# Source Language Pass-Through Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop DeepL guessing the source language per string — have `a11y-toolbar` send the document's language and have `yard-deepl` validate it, falling back to the site locale and then Dutch.

**Architecture:** The browser knows the document language (`<html lang>`); the server owns validation and the fallback chain. The toolbar captures its language **once at init** (before it starts overwriting `<html lang>` itself), normalises it to a bare ISO-639-1 code, and sends it as an optional `source_lang`. `yard-deepl` treats that as a *hint*: it re-validates, and on anything unusable falls back to `get_locale()`, then `'NL'`. Both sides degrade safely, so the two repos can ship independently.

**Tech Stack:** TypeScript + Vite + Jest/jsdom (`a11y-toolbar`); PHP 8 + WordPress REST API (`yard-deepl`).

**Repos:** `a11y-toolbar` at `~/Code/a11y-toolbar` (Tasks 1-2); `yard-deepl` at `~/Code/plugin-yard-deepl` (Tasks 3-5), symlinked into `~/Code/owc-mijn-omgeving/web/app/plugins/yard-deepl` and mounted into Lando, so edits there are live on the site immediately.

**Spec:** This document. Derived from a live investigation on `mijn.hoekschewaard.lndo.site` (post 381) — findings reproduced verbatim in "Evidence" below.

## Global Constraints

- **DeepL rejects regional source tags.** `source_lang=nl-NL` returns HTTP 400 `"Value for 'source_lang' not supported."` Only bare two-letter codes are accepted. `target_lang` is unaffected and keeps its regional variants (`EN-US`).
- **`source_lang` is case-insensitive at the API** (`nl` and `NL` both work). Normalise to uppercase for consistency with `target_lang`.
- **Never read `document.documentElement.lang` after init.** `DeepLButton.ts` overwrites it via `updateLangAttribute()` on every translate/revert.
- **`source_lang` must stay optional** on the REST endpoint. An older toolbar that omits it must keep working.
- **No PHPUnit in `yard-deepl`.** PHP tasks verify via the manual recipe in each task; pure helpers are written so they *could* be unit tested later.
- Ship order: **`yard-deepl` first**, then `a11y-toolbar`. Both directions of version skew are safe, but this order means no window where a valid `source_lang` is sent and discarded.

## Evidence

Measured against the live DeepL API with the site's own key:

| `source_lang` | `["Ja","Nee"]` → EN-US |
|---|---|
| omitted | `"And"` (detected **FI**), `"Yes"` (detected **OM**) |
| `nl` | `"Yes"`, `"No"` ✓ |
| `NL` | `"Yes"`, `"No"` ✓ |
| `nl-NL` | HTTP 400 — not supported |

The site serves `<html lang="nl-NL">`, i.e. exactly the value that 400s. Normalisation is not optional.

---

### Task 1: Normalise a BCP-47 tag to a DeepL source code

**Files:**
- Create: `src/utils/resolveSourceLanguage.ts`
- Test: `test/resolveSourceLanguage.test.ts`

**Interfaces:**
- Produces: `resolveSourceLanguage( lang: string ): string` — returns an uppercase two-letter code, or `''` when the input cannot be used. Task 2 consumes it.

Returning `''` rather than a default is deliberate: an unusable tag should let the **server** pick the fallback, which knows the site locale. Baking `'NL'` in here would hardcode Dutch in a package that ships to non-Dutch sites.

- [ ] **Step 1: Write the failing test**

```typescript
/**
 * Internal dependencies
 */
import { resolveSourceLanguage } from '../src/utils/resolveSourceLanguage';

describe( 'resolveSourceLanguage', () => {
	it( 'strips the region from a BCP-47 tag', () => {
		expect( resolveSourceLanguage( 'nl-NL' ) ).toBe( 'NL' );
	} );

	it( 'accepts an underscore-separated locale', () => {
		expect( resolveSourceLanguage( 'en_US' ) ).toBe( 'EN' );
	} );

	it( 'uppercases a bare language tag', () => {
		expect( resolveSourceLanguage( 'de' ) ).toBe( 'DE' );
	} );

	it( 'ignores surrounding whitespace', () => {
		expect( resolveSourceLanguage( '  fr-BE  ' ) ).toBe( 'FR' );
	} );

	it( 'returns empty for a three-letter code DeepL cannot take', () => {
		expect( resolveSourceLanguage( 'nld' ) ).toBe( '' );
	} );

	it( 'returns empty for a missing or malformed tag', () => {
		expect( resolveSourceLanguage( '' ) ).toBe( '' );
		expect( resolveSourceLanguage( '-' ) ).toBe( '' );
		expect( resolveSourceLanguage( '123' ) ).toBe( '' );
	} );
} );
```

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/jest test/resolveSourceLanguage.test.ts`
Expected: FAIL — `Cannot find module '../src/utils/resolveSourceLanguage'`

- [ ] **Step 3: Write minimal implementation**

```typescript
/**
 * DeepL accepts only a bare ISO-639-1 code as `source_lang`. A regional tag
 * such as `nl-NL` — which is what WordPress puts in `<html lang>` — is
 * rejected with HTTP 400, so the region has to be stripped before sending.
 *
 * Returns an empty string when the tag cannot be used, letting the server
 * fall back to the site locale rather than guessing here.
 */
export const resolveSourceLanguage = ( lang: string ): string => {
	const primarySubtag = ( lang ?? '' ).trim().split( /[-_]/ )[ 0 ] ?? '';

	if ( ! /^[a-z]{2}$/i.test( primarySubtag ) ) {
		return '';
	}

	return primarySubtag.toUpperCase();
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `./node_modules/.bin/jest test/resolveSourceLanguage.test.ts`
Expected: PASS, 6 tests

- [ ] **Step 5: Commit**

```bash
git add src/utils/resolveSourceLanguage.ts test/resolveSourceLanguage.test.ts
git commit -m "feat: normalise document language to a DeepL source code"
```

---

### Task 2: Send `source_lang` from the toolbar

**Files:**
- Modify: `src/components/DeepLButton.ts`
- Test: `test/deepLButtonRequest.test.ts`

**Interfaces:**
- Consumes: `resolveSourceLanguage()` from Task 1.
- Produces: request body gains an optional `source_lang: string`. Task 4 reads it server-side.

**The hazard this task must avoid:** `updateLangAttribute()` (`DeepLButton.ts:260`) assigns `document.documentElement.lang = language` on every translate and revert. Reading the attribute at request time therefore yields the *previous target* language on a second translation, and the request would claim Dutch text is English. Capture once in `init()`, before anything can mutate it, and never read the attribute again.

- [ ] **Step 1: Write the failing test**

This asserts on the real `fetch` payload rather than on a mock's call count, so it fails if the capture moves after the mutation.

```typescript
/**
 * Internal dependencies
 */
import { addDeepLButton } from '../src/components/DeepLButton';

const OPTIONS = { showDeepLButton: true } as never;

describe( 'DeepLButton request body', () => {
	let bodies: Array< Record< string, unknown > >;

	beforeEach( () => {
		bodies = [];
		document.documentElement.lang = 'nl-NL';
		document.body.innerHTML = '<div id="bar"></div><p>Hallo wereld</p>';
		window.sessionStorage.clear();

		( window as never as { ydpl: unknown } ).ydpl = {
			ydpl_rest_translate_url: 'https://example.test/translate',
			ydpl_api_request_nonce: 'nonce',
			ydpl_translate_post_id: '381',
			ydpl_supported_languages: [
				{ iso_alpha2: 'EN-US', name: 'Engels' },
				{ iso_alpha2: 'NL', name: 'Nederlands' },
			],
		};

		global.fetch = jest.fn( ( _url: string, init: { body: string } ) => {
			bodies.push( JSON.parse( init.body ) );
			return Promise.resolve( {
				ok: true,
				json: () => Promise.resolve( [] ),
			} );
		} ) as never;
	} );

	it( 'sends the document language as a bare source_lang', async () => {
		addDeepLButton( document.getElementById( 'bar' )!, OPTIONS );

		const select = document.querySelector(
			'.a11y-toolbar__translate-select'
		) as HTMLSelectElement;
		select.value = 'EN-US';
		select.dispatchEvent( new Event( 'change' ) );
		await Promise.resolve();

		expect( bodies[ 0 ].source_lang ).toBe( 'NL' );
	} );

	it( 'still reports the original language after an earlier translation changed <html lang>', async () => {
		addDeepLButton( document.getElementById( 'bar' )!, OPTIONS );

		const select = document.querySelector(
			'.a11y-toolbar__translate-select'
		) as HTMLSelectElement;

		select.value = 'EN-US';
		select.dispatchEvent( new Event( 'change' ) );
		await Promise.resolve();
		await Promise.resolve();

		// updateLangAttribute() has now overwritten <html lang> with EN-US.
		select.value = 'EN-US';
		select.dispatchEvent( new Event( 'change' ) );
		await Promise.resolve();

		expect( document.documentElement.lang ).toBe( 'EN-US' );
		expect( bodies[ bodies.length - 1 ].source_lang ).toBe( 'NL' );
	} );

	it( 'omits source_lang when the document language is unusable', async () => {
		document.documentElement.lang = '';
		addDeepLButton( document.getElementById( 'bar' )!, OPTIONS );

		const select = document.querySelector(
			'.a11y-toolbar__translate-select'
		) as HTMLSelectElement;
		select.value = 'EN-US';
		select.dispatchEvent( new Event( 'change' ) );
		await Promise.resolve();

		expect( 'source_lang' in bodies[ 0 ] ).toBe( false );
	} );
} );
```

- [ ] **Step 2: Run test to verify it fails**

Run: `./node_modules/.bin/jest test/deepLButtonRequest.test.ts`
Expected: FAIL — `expect(received).toBe('NL')` / received `undefined`

If it instead errors on `focus-trap` or `createSvgIcon`, add `jest.mock( 'focus-trap' )` at the top of the file and re-run until the failure is the assertion, not the setup.

- [ ] **Step 3: Write minimal implementation**

Add the import beside the existing internal dependencies:

```typescript
import { resolveSourceLanguage } from '../utils/resolveSourceLanguage';
```

Declare the captured value alongside the other closure state (near `let languageIcon: string;`):

```typescript
	/**
	 * Captured once in init(). updateLangAttribute() overwrites
	 * <html lang> on every translate, so reading it later would report the
	 * previous target language as the source of the original text.
	 */
	let sourceLanguage = '';
```

Assign it as the very first statement inside `init()`, before the early return:

```typescript
	const init = (): void => {
		sourceLanguage = resolveSourceLanguage( document.documentElement.lang );

		if ( ! options || ! options.showDeepLButton ) return;
```

Extend the request body in `translateText()`:

```typescript
		const requestBody = {
			text: textArray,
			target_lang: targetLang,
			object_id: window.ydpl.ydpl_translate_post_id,
			...( sourceLanguage ? { source_lang: sourceLanguage } : {} ),
		};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `./node_modules/.bin/jest`
Expected: PASS — all suites, including the existing `collectTranslatableTextNodes` tests

- [ ] **Step 5: Typecheck and commit**

```bash
pnpm run typecheck
git add src/components/DeepLButton.ts test/deepLButtonRequest.test.ts
git commit -m "feat: send the document language as source_lang"
```

---

### Task 3: Accept `source_lang` on the REST endpoint

**Files:**
- Modify: `~/Code/plugin-yard-deepl/src/Providers/RestAPIServiceProvider.php:51-91` (the `args` array)
- Create: `~/Code/plugin-yard-deepl/src/Support/LanguageCode.php`

**Interfaces:**
- Produces: `YDPL\Support\LanguageCode::normalize( string $value ): string` — uppercase two-letter code or `''`. Tasks 4 and 5 consume it.
- Produces: REST param `source_lang`, optional, string.

This is the trust boundary: the value arrives from a browser and ends up in an outbound paid API call, so it is re-validated server-side rather than taken on faith. The PHP mirrors Task 1 deliberately — the client normalises so the wire format is clean, the server normalises so it is safe.

- [ ] **Step 1: Create the shared normaliser**

```php
<?php

namespace YDPL\Support;

/**
 * Exit when accessed directly.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @since 2.2.0
 */
class LanguageCode
{
	/**
	 * Reduces a BCP-47 tag or WordPress locale to the bare ISO-639-1 code
	 * DeepL accepts as `source_lang`.
	 *
	 * DeepL rejects regional tags on `source_lang` with HTTP 400, so
	 * 'nl-NL' and 'nl_NL' both have to become 'NL'. Returns an empty string
	 * when the value cannot be used, so callers can fall through.
	 *
	 * @since 2.2.0
	 */
	public static function normalize( string $value ): string
	{
		$parts         = preg_split( '/[-_]/', trim( $value ) );
		$primary_subtag = $parts[0] ?? '';

		if ( ! preg_match( '/^[A-Za-z]{2}$/', $primary_subtag ) ) {
			return '';
		}

		return strtoupper( $primary_subtag );
	}
}
```

- [ ] **Step 2: Add the REST argument**

Insert into the `args` array in `register_routes()`, after the `object_id` entry:

```php
					'source_lang' => array(
						'description'       => 'The language the supplied text is written in. Optional; falls back to the site locale.',
						'type'              => 'string',
						'required'          => false,
						'default'           => '',
						'sanitize_callback' => function ( $value, $request, $param ) {
							return \YDPL\Support\LanguageCode::normalize( sanitize_text_field( $value ) );
						},
					),
```

- [ ] **Step 3: Verify the endpoint accepts and normalises it**

From a logged-in browser console on the site, with the cache bypassed via `object_id: 0`:

```javascript
await fetch( window.ydpl.ydpl_rest_translate_url, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': window.ydpl.ydpl_api_request_nonce },
	credentials: 'include',
	body: JSON.stringify( { text: [ 'Ja' ], target_lang: 'EN-US', object_id: 0, source_lang: 'nl-NL' } ),
} ).then( ( r ) => r.json() );
```

Expected: HTTP 200. It will still return `"And"` until Task 4 threads the value through — this step only proves the argument is accepted and does not 400.

- [ ] **Step 4: Commit**

```bash
git add src/Support/LanguageCode.php src/Providers/RestAPIServiceProvider.php
git commit -m "feat: accept an optional source_lang on the translate endpoint"
```

---

### Task 4: Thread `source_lang` down to the DeepL client

**Files:**
- Modify: `~/Code/plugin-yard-deepl/src/Controllers/RestAPIController.php:~45-75`
- Modify: `~/Code/plugin-yard-deepl/src/Services/TranslationService.php:30,41,68`
- Modify: `~/Code/plugin-yard-deepl/src/Services/DeeplService.php` (`translate()`)
- Modify: `~/Code/plugin-yard-deepl/src/Clients/DeeplClient.php:27-33`

**Interfaces:**
- Consumes: `LanguageCode::normalize()` from Task 3.
- Produces: `DeeplClient::translateText( array $text, string $targetLang, string $sourceLang ): array`.

Note: the clone has no `source_lang` in `DeeplClient::translateText()` — the hardcoded `'nl'` probe existed only in the previously-vendored copy, which has been replaced by this symlink. Nothing to remove; this task adds it properly.

- [ ] **Step 1: Resolve the fallback chain in the controller**

Where `$target_lang` and `$object_id` are read from the request, add:

```php
		/**
		 * Request value first, then the site locale, then Dutch. The request
		 * value has already been normalised by the REST sanitize callback.
		 */
		$source_lang = $request->get_param( 'source_lang' );

		if ( '' === $source_lang ) {
			$source_lang = \YDPL\Support\LanguageCode::normalize( get_locale() );
		}

		if ( '' === $source_lang ) {
			$source_lang = 'NL';
		}
```

Pass it into the service call:

```php
		$translation = $this->service->handle_translation( $object_id, $text, $target_lang, $user_has_cache_capability, $cached_translation, $source_lang );
```

- [ ] **Step 2: Add the parameter through the service layer**

`TranslationService::handle_translation()`:

```php
	public function handle_translation( int $object_id, array $text, string $target_lang, bool $cache = false, ?array $cached_translation = null, string $source_lang = 'NL' ): array
	{
		if ( 0 < $object_id ) {
			return $this->handle_translation_with_object_id( $object_id, $text, $target_lang, $cache, $cached_translation, $source_lang );
		}

		return $this->handle_translation_without_object_id( $text, $target_lang, $source_lang );
	}
```

`handle_translation_with_object_id()` — add `string $source_lang = 'NL'` to the signature and forward it at its one call site:

```php
		$translation = $this->handle_translation_without_object_id( $text, $target_lang, $source_lang );
```

`handle_translation_without_object_id()`:

```php
	public function handle_translation_without_object_id( array $text, string $target_lang, string $source_lang = 'NL' ): array
	{
		return DeeplService::get_instance()->translate( $text, $target_lang, $source_lang );
	}
```

`DeeplService::translate()`:

```php
	public function translate( array $text, string $target_lang, string $source_lang = 'NL' ): array
	{
		$result = $this->client->translateText( $text, $target_lang, $source_lang );

		if ( ! $result ) {
			throw new Exception( 'Failed to translate text.' );
		}

		return $this->combine_result_with_initial_text( $result, $text );
	}
```

- [ ] **Step 3: Send it from the client**

`DeeplClient::translateText()` — replacing the hardcoded probe:

```php
	public function translateText( array $text, string $targetLang, string $sourceLang = 'NL' ): array
	{
		$payload = array(
			'text'        => $text,
			'target_lang' => $targetLang,
			'source_lang' => $sourceLang,
		);
```

- [ ] **Step 4: Verify end to end**

Same console snippet as Task 3, Step 3. Then repeat with `source_lang` omitted entirely.

Expected, both times:

```json
[ { "text": "Ja", "translation": "Yes" } ]
```

The first proves pass-through; the second proves the site-locale fallback. If either returns `"And"`, the value is not reaching `DeeplClient` — add `error_log( $sourceLang )` there and re-check.

- [ ] **Step 5: Commit**

```bash
git add src/Controllers/RestAPIController.php src/Services/TranslationService.php src/Services/DeeplService.php src/Clients/DeeplClient.php
git commit -m "feat: use the requested source language, falling back to the site locale"
```

---

### Task 5: Key the translation cache by source language

**Files:**
- Modify: `~/Code/plugin-yard-deepl/src/Repositories/TranslationRepository.php` (`get_cached_translation`, `store_translation`, `get_column_data`)
- Modify: callers in `~/Code/plugin-yard-deepl/src/Services/TranslationService.php`

**Interfaces:**
- Consumes: `$source_lang` from Task 4.
- Changes stored meta key from `_translation_<target>` to `_translation_<source>_<target>`.

Today the cache is keyed by `object_id` + `target_lang` alone, so a body cached under one source language would be served for a request under another. The key should carry both.

**Deliberate side effect:** every existing cache entry is orphaned by the key change and will be regenerated on next use. That is wanted here — the current entries were written while DeepL was mis-detecting, and at least one is known-corrupt (`{"text":"Nee","translation":"Yes"}` on post 381). `delete_cached_translations()` matches on the `_translation_` prefix, so the orphans are still cleaned by the existing "Clear translation cache?" metabox.

**This task is separable.** If you would rather not touch the cache key, skip it and clear the corrupt caches by hand instead — Tasks 1-4 are complete and correct without it. Note that skipping leaves the mixed-source-language gap open.

- [ ] **Step 1: Add a key helper**

```php
	/**
	 * @since 2.2.0
	 */
	protected function cache_key( string $source_lang, string $target_lang ): string
	{
		return sprintf( '_translation_%s_%s', $source_lang, $target_lang );
	}

	/**
	 * @since 2.2.0
	 */
	protected function modified_key( string $source_lang, string $target_lang ): string
	{
		return sprintf( '_translation_modified_%s_%s', $source_lang, $target_lang );
	}
```

- [ ] **Step 2: Use it in the read path**

```php
	public function get_cached_translation( int $object_id, string $target_lang, string $source_lang = 'NL' ): ?array
	{
		if ( ! $this->translated_object_exists( $object_id ) ) {
			throw new ObjectNotFoundException( 'Translated object not found.', 404 );
		}

		if ( $this->is_cache_disabled( $object_id ) ) {
			return null;
		}

		$post_modified        = get_post_field( 'post_modified', $object_id );
		$cached_translation   = get_post_meta( $object_id, $this->cache_key( $source_lang, $target_lang ), true );
		$translation_modified = get_post_meta( $object_id, $this->modified_key( $source_lang, $target_lang ), true );

		if ( ! $cached_translation || strtotime( $translation_modified ) < strtotime( $post_modified ) ) {
			return null;
		}

		return $cached_translation;
	}
```

- [ ] **Step 3: Use it in the write path**

In `store_translation()`, replace the two `update_post_meta` keys with `$this->cache_key( $source_lang, $target_lang )` and `$this->modified_key( $source_lang, $target_lang )`, adding `string $source_lang = 'NL'` to the signature. Thread `$source_lang` from `TranslationService` into both `get_cached_translation()` and `store_translation()` call sites.

- [ ] **Step 4: Verify**

```bash
lando wp post meta list 381 --format=csv | grep _translation_
```

Expected: after translating post 381 once as a logged-in editor, a `_translation_NL_EN-US` key exists. The old `_translation_EN-US` is still present but no longer read.

- [ ] **Step 5: Commit**

```bash
git add src/Repositories/TranslationRepository.php src/Services/TranslationService.php
git commit -m "feat: include the source language in the translation cache key"
```

---

### Task 6: Verify on post 381 and clear the corrupt cache

**Files:** none — verification only.

- [ ] **Step 1: Clear the stale cache**

Edit page 381 in WP admin → **Yard DeepL** metabox → tick **"Clear translation cache?"** → Update. Also tick **"Disable translation cache?"**: the page embeds a Gravity Form, and the staleness check compares against `post_modified`, which does not move when a form's choices are edited elsewhere.

- [ ] **Step 2: Translate the page to English**

Load `/aanmelden-vanuit-ouder-of-jeugdige-16/`, open the toolbar's translate dropdown, choose Engels (Amerikaans).

- [ ] **Step 3: Confirm every radio label**

```javascript
Array.from( document.querySelectorAll( 'input[type=radio]' ) ).map( ( r ) => {
	const label = document.querySelector( `label[for="${ r.id }"]` );
	return `${ r.name }: ${ label?.textContent }`;
} );
```

Expected:

```
input_15: Yes, that's allowed
input_15: No, you can't do that
input_16: Yes
input_16: No
```

Before this work the same call returned `Ja dat mag`, `Nee dat mag niet`, `Ja`, `Yes` — two untranslated, one untouched, one inverted.

- [ ] **Step 4: Confirm the request carried the language**

In DevTools → Network → the `translate` request → Payload. Expected: `"source_lang": "NL"`, and `text` containing `"Ja"`.

---

## Notes for the reviewer

- **`Ja` only reaches the API at all because of the separate capture fix** already on this branch (dropping the `length <= 2` guard in `collectTranslatableTextNodes`). Without it, Task 6 Step 3 still shows `Ja` untranslated no matter how correct `source_lang` is.
- **Ship `yard-deepl` before `a11y-toolbar`.** New plugin + old toolbar is fine (falls back to site locale). New toolbar + old plugin is also fine (`source_lang` is ignored). The stated order just avoids sending a good value into a version that discards it.
- **Out of scope, worth a follow-up:** the cache stores a logged-in editor's whole-page capture, admin bar included, and serves it to every visitor who translates — currently leaking `Network Admin`, `Log Out`, `Branch: main`, the environment switcher and the admin's display name into the response body for post 381.
