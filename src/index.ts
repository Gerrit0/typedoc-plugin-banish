import * as T from "typedoc";
import * as M from "minimatch";
import { ProjectReflection } from "typedoc";

declare module "typedoc" {
  export interface TypeDocOptionMap {
    banish: string[];
    invertBanish: boolean;
  }
}

export function load({ application }: { application: T.Application }) {
  application.options.addDeclaration({
    name: "banish",
    help:
      "Array of minimatch patterns to match declaration locations against. If any match, the item will not be included in the documentation.",
    type: T.ParameterType.Array,
    defaultValue: ["**/node_modules/**"],
  });
  application.options.addDeclaration({
    name: "invertBanish",
    help: "If set, inverts the filter, so only files which match are included.",
    type: T.ParameterType.Boolean,
    defaultValue: false,
  });

  application.converter.on(
    "resolveBegin",
    ({ project }: { project: ProjectReflection }) => {
      if (application.options.getValue("disableSources")) {
        application.logger.warn(
          "[typedoc-plugin-banish] Cannot filter based on source file if --disableSources is passed."
        );
        return;
      }

      const patterns = application.options
        .getValue("banish")
        .map(
          (pattern) =>
            new M.Minimatch(pattern.replace(/\\/g, "/"), { dot: true })
        );
      const invert = application.options.getValue("invertBanish");

      for (const reflection of Object.values(project.reflections)) {
        if (!reflection.sources) continue;

        let matches = patterns.some((pattern) =>
          reflection.sources!.some((ref) => pattern.match(ref.fileName))
        );

        if (invert) {
          matches = !matches;
        }

        if (matches) {
          project.removeReflection(reflection, true);
        }
      }
    }
  );
}
