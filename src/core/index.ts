import { get } from "node-emoji";
import { getFilesToProcess, processFiles } from "./fileProcessor";
import { createBackupManifest } from "../utils/backupHandler";
import { loadConfig, mergeConfigWithOptions } from "../config/loader";
import { DEFAULT_OPTIONS } from "../config/constants";
import { ClearCommentsOptions, ProcessingStats } from "../types";

/**
 * This function handles the entire project cleanup — it removes all matched comments from files.
 */
export async function clearComments(
  options: ClearCommentsOptions = {}
): Promise<ProcessingStats> {
  // Load config file if the user provide am
  const config = loadConfig(options.configPath);

  // Join config from file and options from CLI
  const finalOptions = mergeConfigWithOptions(config, options);

  const {
    targetDir = DEFAULT_OPTIONS.targetDir,
    excludePatterns = [...DEFAULT_OPTIONS.excludePatterns],
    verbose = DEFAULT_OPTIONS.verbose,
    backup = false,
    backupDir = "./.backup",
  } = finalOptions;

  // If verbose mode dey enabled, we go log the steps with emoji vibes
  if (verbose) {
    console.log(`${get("broom")} Clearing comments from: ${targetDir}`);
    console.log(
      `${get("memo")} Comment types to remove: ${
        finalOptions.removeTypes?.join(", ") || "default"
      }`
    );
    if (finalOptions.customPatterns?.length) {
      console.log(
        `${get("mag")} Custom patterns count: ${finalOptions.customPatterns.length}`
      );
    }
    if (backup) {
      console.log(`${get("floppy_disk")} Backups will be saved to: ${backupDir}`);
    }
  }

  try {
    // Gather all files wey match
    const files = await getFilesToProcess(targetDir, excludePatterns);

    // If backup dey on and we get files, we go backup
    if (backup && files.length > 0) {
      createBackupManifest(backupDir, files);
    }

    // Process the files to remove comments
    const stats = await processFiles(files, targetDir, finalOptions);

    return stats;
  } catch (error) {
    // If wahala burst, catch am here
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      totalFiles: 0,
      processedFiles: 0,
      totalLinesRemoved: 0,
      backupsCreated: 0,
      errors: [`Global error:: ${errorMessage}`],
    };
  }
}
