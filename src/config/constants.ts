export const SUPPORTED_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"] as const;
export type SupportedExtension = (typeof SUPPORTED_EXTENSIONS)[number];

export const EXCLUDE_PATTERNS = [
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/.git/**",
  "**/coverage/**",
  "**/.next/**",
  "**/out/**",
  "**/public/**",
  "**/static/**",
  "**/.turbo/**",
  "**/.vscode/**",
] as const;

export const DEFAULT_OPTIONS = {
  preserveJSDoc: true,
  verbose: false,
  targetDir: process.cwd(),
  excludePatterns: ["node_module", "dist"],
} as const;