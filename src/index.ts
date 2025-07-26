import { clearComments } from "./core";
import { loadConfig } from "./config/loader";
import {
  displayResults,
  handleRestore,
  parseArgs,
  showBanner,
  showHelp,
} from "./cli/cli";

/**
 * CLI entry point
 */
async function cli(): Promise<void> {
  const args = process.argv.slice(2);
  const parsedArgs = parseArgs(args);

  // Show help if requested
  if (parsedArgs.help) {
    showHelp();
    return;
  }

  // Handle restore command
  if (parsedArgs.restore) {
    await handleRestore(parsedArgs.restore);
    return;
  }

  // Load configuration
  const config = loadConfig(parsedArgs.configPath);

  // Show startup banner
  showBanner(parsedArgs.targetDir, parsedArgs.backup || config.backup || false);

  try {
    const stats = await clearComments({
      targetDir: parsedArgs.targetDir,
      verbose: parsedArgs.verbose,
      preserveJSDoc: parsedArgs.preserveJSDoc,
      backup: parsedArgs.backup || config.backup,
      backupDir: parsedArgs.backupDir || config.backupDir,
      configPath: parsedArgs.configPath,
      removeTypes: config.removeTypes,
      customPatterns: config.customPatterns,
      excludePatterns: config.excludePatterns,
    });

    // Display results
    displayResults(stats, parsedArgs.verbose);

    // Exit with error code if there were errors
    if (stats.errors.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error(
      "❌ Unexpected error:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

// Export for programmatic use
export { clearComments } from "./core";
export { removeComments } from "./core/commentRemover";
export { processFile } from "./core/fileProcessor";
export { loadConfig } from "./config/loader";


// Run CLI if called directly
if (require.main === module) {
  cli().catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
}
