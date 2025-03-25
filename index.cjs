const postcss = require("postcss");

const CUSTOM_SET_RE = /^--[A-z0-9-_]+$/;

module.exports = postcss.plugin("postcss-apply-compat", () => {
  return (root, result) => {
    const propertySets = new Map();

    // First pass: extract property sets
    root.walkRules((rule) => {
      rule.walkDecls((decl) => {
        if (CUSTOM_SET_RE.test(decl.prop)) {
          const value = decl.value.trim();

          if (!value.startsWith("{") || !value.endsWith("}")) {
            decl.warn(
              result,
              `Property set "${decl.prop}" must be enclosed in curly braces.`
            );
            return;
          }

          // Validate semicolon after closing brace
          if (!/}\s*;$/.test(decl.raws.value?.raw || decl.toString())) {
            decl.warn(
              result,
              `Property set "${decl.prop}" is missing a trailing semicolon after '}'.`
            );
          }

          // Extract properties inside the curly braces
          const propertiesBlock = value.slice(1, -1).trim();
          propertySets.set(decl.prop, propertiesBlock);

          // Remove property set declaration from final CSS
          decl.remove();
        }
      });
    });

    // Second pass: apply property sets
    root.walkRules((rule) => {
      rule.walkAtRules("apply", (atRule) => {
        const params = atRule.params.split(/\s+/);

        params.forEach((setName) => {
          if (!CUSTOM_SET_RE.test(setName)) {
            atRule.warn(
              result,
              `"${setName}" is not a valid custom property set.`
            );
            return;
          }

          const properties = propertySets.get(setName);
          if (!properties) {
            atRule.warn(result, `Custom property set "${setName}" not found.`);
            return;
          }

          // Parse and insert the declarations from property set
          rule.append(postcss.parse(properties).nodes);
        });

        atRule.remove();
      });
    });
  };
});
