# typedoc-plugin-banish

A plugin for [TypeDoc](https://typedoc.org/) which filters reflections according to their declaration location, like `--exclude` but better since it also catches inherited items.

This plugin adds two options:

| Option         | Default                  | Description                                                                                                                           |
| -------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `banish`       | `["**/node_modules/**"]` | Array of minimatch patterns to match declaration locations against. If any match, the item will not be included in the documentation. |
| `invertBanish` | `false`                  | If set, only include declarations whose locations are matched by `banish`                                                             |

TypeDoc automatically loads plugins, so all you need to do to use this plugin is install it. If you selectively load plugins, add it to your plugins array in `typedoc.json`

```json
{
  "banish": ["**/node_modules/**", "**/src/internal.ts"],
  "invertBanish": false,
  "plugins": ["typedoc-plugin-banish"]
}
```
