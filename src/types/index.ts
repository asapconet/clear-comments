export interface ClearCommentsOptions {
  targetDir?: string;
  preserveJSDoc?: boolean;
  excludePatterns?: string[];
  verbose?: boolean;
}
export interface ProcessFileResult {
  wasModified: boolean;
  originalLines: number;
  newLines: number;
  error?: string;
}
export interface ProcessingStats {
  totalFiles: number;
  processedFiles: number;
  totalLinesRemoved: number;
  errors: string[];
}
export interface CLIArgs {
  targetDir: string;
  verbose: boolean;
  preserveJSDoc: boolean;
  help: boolean;
}
