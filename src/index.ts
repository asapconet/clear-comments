import { clearComments } from "./core";
import { loadConfig } from "./config/loader";
import {
  displayResults,
  handleRestore,
  parseArgs,
  showBanner,
  showHelp,
} from "./cli/cli";
import { logError } from "./utils/logger";

async function cli(): Promise<void> {
  const args = process.argv.slice(2);
  const parsedArgs = parseArgs(args);

  if (parsedArgs.help) {
    showHelp();
    return;
  }

  if (parsedArgs.restore) {
    await handleRestore(parsedArgs.restore);
    return;
  }

  const config = loadConfig(parsedArgs.configPath);

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

    displayResults(stats, parsedArgs.verbose);

    if (stats.errors.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    logError(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

export { clearComments } from "./core";
export { removeComments } from "./core/commentRemover";
export { processFile } from "./core/fileProcessor";
export { loadConfig } from "./config/loader";

if (require.main === module) {
  cli().catch((error) => {
    logError(error);
    process.exit(1);
  });
}
