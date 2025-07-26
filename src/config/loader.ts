import * as fs from "fs";

export interface ConfigFile {
  targetDir?: string;
  preserveJSDoc?: boolean;
  removeTypes?: ("single-line" | "multi-line" | "html" | "jsdoc")[];
  customPatterns?: string[];
  excludePatterns?: string[];
  backup?: boolean;
  backupDir?: string;
  verbose?: boolean;
}

export const DEFAULT_CONFIG: ConfigFile = {
  preserveJSDoc: true,
  removeTypes: ["single-line", "multi-line", "html"],
  customPatterns: [],
  excludePatterns: [],
  backup: false,
  backupDir: "./.backup",
};

export function loadConfig(configPath?: string): ConfigFile {
  const configFiles = [
    configPath,
    ".clearrc",
    ".clearrc.json",
    "clear-comments.config.json",
  ].filter(Boolean);

  for (const configFile of configFiles) {
    if (configFile && fs.existsSync(configFile)) {
      try {
        const configContent = fs.readFileSync(configFile, "utf8");
        const config = JSON.parse(configContent);
        return { ...DEFAULT_CONFIG, ...config };
      } catch (error) {
        console.warn(`⚠️ Warning: No fit read config file: ${configFile}`);
      }
    }
  }

  return DEFAULT_CONFIG;
}

export function mergeConfigWithOptions(
  config: ConfigFile,
  cliOptions: any
): ConfigFile {
  return {
    ...config,
    ...cliOptions,
    removeTypes: cliOptions.removeTypes || config.removeTypes,
    customPatterns: cliOptions.customPatterns || config.customPatterns,
    excludePatterns: [
      ...(config.excludePatterns || []),
      ...(cliOptions.excludePatterns || []),
    ],
  };
}
