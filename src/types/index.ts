export type CommentType = "single-line" | "multi-line" | "html" | "jsdoc";

export interface ClearCommentsOptions {
  targetDir?: string;
  removeEmptyLines?: boolean;
  preserveJSDoc?: boolean;
  removeTypes?: CommentType[];
  customPatterns?: string[];
  excludePatterns?: string[];
  verbose?: boolean;
  backup?: boolean;
  backupDir?: string;
  configPath?: string;
}

export interface ProcessFileResult {
  wasModified: boolean;
  originalLines: number;
  newLines: number;
  backupPath?: string;
  error?: string;
}

export interface ProcessingStats {
  totalFiles: number;
  processedFiles: number;
  totalLinesRemoved: number;
  backupsCreated: number;
  errors: string[];
}

export interface CLIArgs {
  targetDir: string;
  verbose: boolean;
  preserveJSDoc: boolean;
  backup: boolean;
  backupDir: string;
  configPath?: string;
  help: boolean;
  restore?: string;
  removeEmptyLines: boolean;
}
