# postcss-apply-compat

> A compact and compatible replacement for the deprecated PostCSS `@apply` rule (from RFC) for PostCSS@8.

## Installation

```sh
npm install postcss-apply-compat --save-dev
yarn add -D postcss-apply-compat
```

## Usage

**`postcss.config.js`:**

```js
module.exports = {
  plugins: [require("postcss-apply-compat")()],
};
```

### Example input CSS:

```css
:root {
  --small: {
    line-height: 1.3;
  }
  --xSmall: {
    line-height: 1.2;
  } /* missing semicolon */
}

.title {
  @apply --small;
}

.subtitle {
  @apply --xSmall;
}
```

### Example output CSS and warnings:

**CSS Output:**

```css
.title {
  line-height: 1.3;
}

.subtitle {
  line-height: 1.2;
}
```

**Warnings during compilation:**

```
⚠️  Property set "--xSmall" is missing a trailing semicolon after '}'. [line:4, column:3]
```

## License

UNLICENSED, I'm working on it.
