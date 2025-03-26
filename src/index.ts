import postcss, { Plugin, Root, Result, Declaration, Rule, AtRule } from 'postcss';

const CUSTOM_PROP_RE = /^--[A-Za-z0-9-_]+$/;

function postcssApplyCompat(): Plugin {
  return {
    // required for naming
    postcssPlugin: 'postcss-apply-compat',

    // once per root
    Once(root: Root, { result }: { result: Result }) {
      const propertySets = new Map<string, string>();

      // extract valid property sets
      root.walkRules((rule: Rule) => {
        rule.walkDecls((decl: Declaration) => {
          if (!CUSTOM_PROP_RE.test(decl.prop)) return;

          const rawValue = decl.value.trim();
          const isPropSet = rawValue.startsWith('{') && rawValue.endsWith('}');

          // only treat as property set if enclosed in { }
          if (isPropSet) {
            // check for trailing semicolon after closing brace
            const declRawValue = decl.raws.value?.raw || decl.toString();
            if (!/}\s*;$/.test(declRawValue)) {
              decl.warn(result, `Property set "${decl.prop}" is missing a trailing semicolon after '}'.`);
            }

            const innerCss = rawValue.slice(1, -1).trim();

            if (!innerCss) {
              decl.warn(result, `Property set "${decl.prop}" is empty.`);
            }

            propertySets.set(decl.prop, innerCss);
            // remove from final CSS
            decl.remove();
          }
          // else ignore single-value custom props
        });
      });

      // replace @apply with these sets
      root.walkRules((rule: Rule) => {
        rule.walkAtRules('apply', (atRule: AtRule) => {
          const setsToApply = atRule.params.split(/\s+/);

          setsToApply.forEach((setName) => {
            if (!CUSTOM_PROP_RE.test(setName)) {
              atRule.warn(result, `"${setName}" is not a valid custom property set.`);
              return;
            }

            const properties = propertySets.get(setName);
            if (!properties) {
              atRule.warn(result, `Custom property set "${setName}" not found.`);
              return;
            }

            try {
              // parse + append
              const parsedNodes = atRule.source?.input?.css
                // the neet thing about this.* somehow its unbound from using globally scoped postcss
                // line below will be always produce typing error
                // ? this.postcss.parse(properties).nodes
                ? postcss.parse(properties).nodes
                : require('postcss').parse(properties).nodes;

              rule.append(parsedNodes!);
            } catch (e: any) {
              atRule.warn(result, `Parsing error in property set "${setName}": ${e.message}`);
            }
          });

          // remove @apply
          atRule.remove();
        });
      });
    },
  };
}

// postcss plugin sign
postcssApplyCompat.postcss = true;

export = postcssApplyCompat;
