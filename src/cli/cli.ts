import { clearComments } from "../core";
import { logError, logVerbose } from "../utils/logger";

function parseArgs(args: string[]): {
  targetDir: string;
  verbose: boolean;
  preserveJSDoc: boolean;
  help: boolean;
} {
  return {
    targetDir: process.cwd(),
    verbose: args.includes("--verbose"),
    preserveJSDoc: !args.includes("--no-jsdoc"),
    help: args.includes("--help"),
  };
}

function showHelp(): void {
  console.log(`
    Usage: comment-cleaner [options]

    Options:
      --target-dir <path>    Directory to clean (default: current directory)
      --verbose             Show detailed output
      --no-jsdoc            Remove JSDoc comments too
      --help                Show this help message
  `);
}

function showBanner(targetDir: string): void {
  logVerbose(`Comment Cleaner starting for: ${targetDir}`);
}

function displayResults(
  stats: import("../types").ProcessingStats,
  verbose: boolean
): void {
  if (verbose) {
    logVerbose(`Total files scanned: ${stats.totalFiles}`);
    logVerbose(`Files modified: ${stats.processedFiles}`);
    logVerbose(`Lines removed: ${stats.totalLinesRemoved}`);
    if (stats.errors.length > 0) {
      logError(`Errors encountered: ${stats.errors.length}`);
      stats.errors.forEach((error) => logError(error));
    }
  }
}

// This be the main gate wey the CLI dey pass through
export async function cli(): Promise<void> {
  const args = process.argv.slice(2);
  const parsedArgs = parseArgs(args);
  if (parsedArgs.help) {
    showHelp();
    return;
  }

  // Flash the startup banner make everybody see say we don land
  showBanner(parsedArgs.targetDir);

  try {
    const stats = await clearComments({
      targetDir: parsedArgs.targetDir,
      verbose: parsedArgs.verbose,
      preserveJSDoc: parsedArgs.preserveJSDoc,
    });

    displayResults(stats, parsedArgs.verbose);

    if (stats.errors.length > 0) {
      process.exit(1);
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
