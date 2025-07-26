import { get } from "node-emoji";
import { CLIArgs, ProcessingStats } from "../types";
import { restoreFromBackup } from "../utils/backupHandler";
import { logError } from "../utils/logger";

export function parseArgs(args: string[]): CLIArgs {
  const targetDir = args.find((arg) => !arg.startsWith("-")) || process.cwd();

  return {
    targetDir,
    verbose: args.includes("--verbose") || args.includes("-v"),
    preserveJSDoc: !args.includes("--no-jsdoc"),
    backup: args.includes("--backup"),
    backupDir: getArgValue(args, "--backup-dir") || "./.backup",
    configPath: getArgValue(args, "--config"),
    help: args.includes("--help") || args.includes("-h"),
    restore: getArgValue(args, "--restore"),
    preserveEmptyLines: args.includes("--preserve-empty-lines"),
  };
}

function getArgValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  return index !== -1 && index + 1 < args.length ? args[index + 1] : undefined;
}

export function showHelp(): void {
  console.log(`
  ${get(":broom:")} Clear Comments v0.1.2

USAGE:
  clear-comments [directory] [options]

ARGUMENTS:
  directory         Target directory to process (default: current directory)

OPTIONS:
  -v, --verbose     Show detailed output
  --no-jsdoc        Remove JSDoc comments as well
  --backup          Create backup before processing
  --backup-dir      Backup directory (default: ./.backup)
  --config          Path to configuration file
  --restore <dir>   Restore files from backup directory
  --preserve-empty-lines   Keep empty lines after comment removal

  -h, --help        Show this help message

CONFIGURATION FILE:
  Create .clearrc or clear-comments.config.json:
  {
    "preserveJSDoc": true,
    "removeTypes": ["single-line", "multi-line", "html"],
    "customPatterns": ["/\\\\*\\\\s*TODO.*?\\\\*/"],
    "backup": true,
    "backupDir": "./.backup"
  }

EXAMPLES:
  clear-comments                          # Process current directory
  clear-comments ./src                    # Process src directory
  clear-comments --verbose --backup       # Process with backup and verbose output
  clear-comments --config .clearrc        # Use custom config file
  clear-comments --restore ./.backup      # Restore from backup

SUPPORTED FILES:
  .js, .jsx, .ts, .tsx
`);
}

export async function handleRestore(backupDir: string): Promise<void> {
  try {
    console.log(`${get(":repeat;")} Restoring files from backup: ${backupDir}`);
    const result = restoreFromBackup(backupDir);

    console.log(
      `${get(":white_check_mark:")} Restored ${result.restored} files`
    );

    if (result.errors.length > 0) {
      console.log(
        `${get(":warning:")}  ${result.errors.length} errors occurred:`
      );
      result.errors.forEach((error) => logError(error));
    }
  } catch (error) {
    logError(
      `Omo, something scatter o: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    process.exit(1);
  }
}

export function displayResults(stats: ProcessingStats, verbose: boolean): void {
  console.log(`\n${get("bar_chart")} Summary:`);
  console.log(`   Files scanned: ${stats.totalFiles}`);
  console.log(`   Files modified: ${stats.processedFiles}`);
  console.log(`   Lines removed: ${stats.totalLinesRemoved}`);

  if (stats.backupsCreated > 0) {
    console.log(`   Backups created: ${stats.backupsCreated}`);
  }

  if (stats.errors.length > 0) {
    console.log(`   Errors: ${stats.errors.length}`);
    if (verbose) {
      stats.errors.forEach((error) => logError(`  ${error}`));
    }
  }

  if (stats.processedFiles === 0 && stats.errors.length === 0) {
    console.log(`\n${get("sparkles")} No comments found to remove.`);
  } else if (stats.processedFiles > 0) {
    console.log(
      `\n${get("tada")} Successfully cleaned ${stats.processedFiles} files!`
    );
  }
}

export function showBanner(targetDir: string, hasBackup: boolean): void {
  console.log(`${get("broom")} Clear Comments v0.1.0`);
  console.log(`${get("file_folder")} Target: ${targetDir}`);
  if (hasBackup) {
    console.log(`${get("floppy_disk")} Backup: Enabled`);
  }
}
