# A11y Toolbar

Easily add an accessibility toolbar to Yard projects.

## ✅ Getting started

### Step 1: Install @yardinternet/a11y-toolbar

```bash
npm install --save @yardinternet/a11y-toolbar
```

### Step 2: Import CSS files

```CSS
@import '~@yardinternet/a11y-toolbar/dist/a11y-toolbar';
```

### Step 3: Initialize A11yToolbar

```JS
import A11yToolbar from '@yardinternet/a11y-toolbar';

document.addEventListener( 'DOMContentLoaded', function () {
    const selector = '.js-a11y-toolbar';
    const options = {
        ...
    };
    new A11yToolbar(selector, options).init();
} );
```

## ⚙️ Options

Currently available options and their defaults.

```JS
const options = {
 showReadSpeakerButton: true,
 showTextSizeButton: true,
 showContrastButton: true,
 showPrintButton: true,
 showLanguageButton: true,
 readSpeakerCustomerID: '9999',
 readSpeakerContentID: 'readspeakers',
 iconOptions: {
  toggleIcon: 'fa-regular fa-universal-access',
  readSpeakerIcon: 'fa-light fa-volume',
  textSizeIcon: 'fa-light fa-text-height',
  contrastIcon: 'fa-light fa-adjust',
  printIcon: 'fa-light fa-print',
  languageIcon:
   '<svg xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" class="a11y-toolbar__flag" viewBox="0 0 20 15"> <mask id="mask0" width="20" height="15" x="0" y="0" mask-type="alpha" maskUnits="userSpaceOnUse"> <path fill="#fff" d="M0 0h20v15H0z"/> </mask> <g mask="url(#mask0)"> <path fill="#F7FCFF" fill-rule="evenodd" d="M0 0v15h20V0H0Z" clip-rule="evenodd"/> <mask id="mask1" width="20" height="15" x="0" y="0" mask-type="alpha" maskUnits="userSpaceOnUse"> <path fill="#fff" fill-rule="evenodd" d="M0 0v15h20V0H0Z" clip-rule="evenodd"/> </mask> <g fill-rule="evenodd" clip-rule="evenodd" mask="url(#mask1)"> <path fill="#E31D1C" d="M0 0v5h20V0H0Z"/> <path fill="#3D58DB" d="M0 10v5h20v-5H0Z"/> </g> </g> </svg>',
 },
 textAfterOptions: {
  readSpeakerTextAfter: '',
  textSizeTextAfter: '',
  contrastTextAfter: '',
  printTextAfter: '',
  languageTextAfter: 'Translate',
 },
 labelOptions: {
  readSpeakerLabel: 'Laat de tekst voorlezen met ReadSpeaker webReader',
  textSizeIncreaseLabel: 'Vergroot schermtekst',
  textSizeDecreaseLabel: 'Verklein schermtekst',
  contrastIncreaseLabel: 'Vergroot schermcontrast',
  contrastDecreaseLabel: 'Verklein schermcontrast',
  printLabel: 'Print pagina',
  languageLabel: 'Toon vertaalopties',
 },
};

```

## 🎨 Styles

Easily change the A11yToolbar styles using CSS variables. Currently available variables and their defaults:

```CSS
.js-a11y-toolbar {
 --a11y-toolbar-zindex: 999;
 --a11y-toolbar-button-size: 45px;
 --a11y-toolbar-button-size-md: 60px;
 --a11y-toolbar-border-radius: 0px;
 --a11y-toolbar-toggle-button-border-radius: 0px;
 --a11y-toolbar-button-color: #000;
 --a11y-toolbar-button-color-hover: #000;
 --a11y-toolbar-button-background-color: #fff;
 --a11y-toolbar-button-background-color-hover: #f1f5f9;
 --a11y-toolbar-toggle-button-color: #000;
 --a11y-toolbar-toggle-button-color-hover: #000;
 --a11y-toolbar-toggle-button-background-color: #fff;
 --a11y-toolbar-toggle-button-background-color-hover: #f1f5f9;
 --a11y-toolbar-icon-size: 1.1rem;
 --a11y-toolbar-icon-size-md: 1.5rem;
}
```

## 👷‍♀️ Package development

1. Run `npm link` inside this project.
2. Run `npm link @yardinternet/a11y-toolbar` inside the project or theme. This will create a symbolic link to the project folder.
3. Run `npm run start` inside this project AND the equivalent script inside the project or theme.

## 🚀 How to publish

1. Change the version of `package.json` to the desired version and commit this change.
2. Go to [releases of the package](https://github.com/yardinternet/a11y-toolbar/releases) and click on "Draft a new release"
3. Click "Choose a tag", type the corresponding version and press Enter. Add a title and description for the release.
4. Click "Publish release"

The Github Workflow `release-package.yml` will run whenever a release is created in this repository. If the tests pass, then the package will be published to Github packages.
