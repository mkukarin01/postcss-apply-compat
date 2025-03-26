# postcss-apply-compat

> A compact, robust, and fully typed PostCSS@8-compatible plugin to replace the deprecated `@apply` rule.

## Why this plugin?

PostCSS 8 dropped support for the legacy `@apply` rule (part of an old RFC). `postcss-apply-compat` provides a seamless migration path for teams moving from PostCSS 7 to PostCSS 8, ensuring your custom property sets still work as expected, with minimal configuration and full type safety.

## Features

✅ **Fully compatible** with PostCSS 8  
✅ **TypeScript support** with comprehensive declarations  
✅ Clear and informative **warnings for incorrect syntax**  
✅ **Minimal dependencies**: fast and robust (bundled via esbuild)

## Installation

```sh
npm install postcss-apply-compat --save-dev
yarn add -D postcss-apply-compat
```

## Usage

In your `postcss.config.js`:

```js
module.exports = {
  plugins: [
    require('postcss-apply-compat')()
  ]
};
```

### Example

**Input CSS:**

```css
:root {
  --button: {
    padding: 10px 20px;
    border-radius: 5px;
  };
}

.primary-btn {
  @apply --button;
  background-color: blue;
}
```

**Output CSS:**

```css
.primary-btn {
  padding: 10px 20px;
  border-radius: 5px;
  background-color: blue;
}
```

### Warnings during compilation:

```
⚠  Property set "--display" is missing a trailing semicolon after '}'. [postcss-apply-compat]
⚠  Custom property set "--regular" not found. [postcss-apply-compat]
```

## Migration from PostCSS 7

Simply replace your old `postcss-apply` plugin with `postcss-apply-compat` in your PostCSS configuration. The new plugin uses the latest PostCSS 8 plugin syntax for improved reliability and future-proofing.

## License

UNLICENSED, I'm working on it.
