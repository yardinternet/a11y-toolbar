# A11y Toolbar

Easily add an accessibility toolbar to Yard projects.

## ✅ Getting started

### Step 1: Install @yardinternet/a11y-toolbar

```bash
npm install --save @yardinternet/a11y-toolbar
```

### Step 2: Initialize A11yToolbar

```JS
import A11yToolbar from '@yardinternet/a11y-toolbar';

document.addEventListener( 'DOMContentLoaded', function () {
    const options = {
        ...
    };
    new A11yToolbar(options).init();
} );
```

## ⚙️ Changing options

TBA.

## 👷‍♀️ Package development

1. Run `npm link` inside this project.
2. Run `npm link @yardinternet/a11y-toolbar` inside the project or theme. This will create a symbolic link to the project folder.
3. Run `npm run start` inside this project AND the equivalent script inside the project or theme.
Note: Its important for the DTS-CLI to only output 1 format type, otherwise the live reloading wont work properly.
We have chosen to use ESM, since its a smaller format than CSJ, but it does mean we don't support using this package with "require".

## 🚀 How to publish

1. Change the version of `package.json` to the desired version and commit this change.
2. Go to [releases of the package](https://github.com/yardinternet/a11y-toolbar/releases) and click on "Draft a new release"
3. Click "Choose a tag", type the corresponding version and press Enter. Add a title and description for the release.
4. Click "Publish release"

The Github Workflow `release-package.yml` will run whenever a release is created in this repository. If the tests pass, then the package will be published to Github packages.
