import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import {
  removeComments,
  isSupportedExtension,
  convertLegacyOptions,
} from "./commentRemover";
import { createFileBackup } from "../utils/backupHandler";
import { SUPPORTED_EXTENSIONS, EXCLUDE_PATTERNS } from "../config/constants";
import {
  ClearCommentsOptions,
  ProcessFileResult,
  ProcessingStats,
} from "../types";
import { get } from "node-emoji";

// This function dey handle one file, chop off comments clean
export async function processFile(
  filePath: string,
  options: ClearCommentsOptions = {}
): Promise<ProcessFileResult> {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const fileExtension = path.extname(filePath);

    // We dey only work with files wey we support o
    if (!isSupportedExtension(fileExtension)) {
      return {
        wasModified: false,
        originalLines: content.split("\n").length,
        newLines: content.split("\n").length,
        error: `Unsupported file extension: ${fileExtension}`,
      };
    }

    const originalLines = content.split("\n").length;

    // this guy go check which comment type we go commot
    let removeTypes = options.removeTypes;
    if (!removeTypes) {
      // If e no specify, we go fallback to legacy preserveJSDoc
      removeTypes = convertLegacyOptions(options.preserveJSDoc);
    }

    const cleanedContent = removeComments(
      content,
      fileExtension,
      removeTypes,
      options.customPatterns || []
    );
    const newLines = cleanedContent.split("\n").length;

    // We go only write back if something change for the file
    if (cleanedContent !== content) {
      let backupPath: string | undefined;

      // If you wan run backup, this guy go create am
      if (options.backup && options.backupDir) {
        const backupResult = createFileBackup(filePath, options.backupDir);
        if (backupResult.success) {
          backupPath = backupResult.backupPath;
        } else {
          return {
            wasModified: false,
            originalLines,
            newLines,
            error: `Backup fail: ${backupResult.error}`,
          };
        }
      }

      fs.writeFileSync(filePath, cleanedContent, "utf8");

      return {
        wasModified: true,
        originalLines,
        newLines,
        backupPath,
      };
    }

    return {
      wasModified: false,
      originalLines,
      newLines,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      wasModified: false,
      originalLines: 0,
      newLines: 0,
      error: errorMessage,
    };
  }
}

// This one dey gather all the files wey we go process based on pattern
export async function getFilesToProcess(
  targetDir: string,
  excludePatterns: string[] = []
): Promise<string[]> {
  const patterns = SUPPORTED_EXTENSIONS.map((ext) =>
    path.join(targetDir, `**/*${ext}`).replace(/\\/g, "/")
  );

  // Join default exclude with the one wey user pass
  const allExcludePatterns = [...EXCLUDE_PATTERNS, ...excludePatterns];

  const allFiles: string[] = [];

  for (const pattern of patterns) {
    const files = await glob(pattern, {
      ignore: allExcludePatterns,
      absolute: true,
    });
    allFiles.push(...files);
  }

  return allFiles;
}

// This function dey handle plenty files and give us stats
export async function processFiles(
  files: string[],
  targetDir: string,
  options: ClearCommentsOptions = {}
): Promise<ProcessingStats> {
  const stats: ProcessingStats = {
    totalFiles: 0,
    processedFiles: 0,
    totalLinesRemoved: 0,
    backupsCreated: 0,
    errors: [],
  };

  for (const file of files) {
    stats.totalFiles++;
    const result = await processFile(file, options);

    if (result.error) {
      stats.errors.push(`${path.relative(targetDir, file)}: ${result.error}`);
      if (options.verbose) {
        console.error(
          `${get("x")} Error processing ${path.relative(targetDir, file)}: ${
            result.error
          }`
        );
      }
      continue;
    }

    if (result.wasModified) {
      stats.processedFiles++;
      const linesRemoved = result.originalLines - result.newLines;
      stats.totalLinesRemoved += linesRemoved;

      if (result.backupPath) {
        stats.backupsCreated++;
      }

      if (options.verbose) {
        const backupInfo = result.backupPath ? " (backup created)" : "";
        console.log(
          `${get("white_check_mark")} Cleaned: ${path.relative(
            targetDir,
            file
          )} (${linesRemoved} lines removed)${backupInfo}`
        );
      }
    } else if (options.verbose) {
      console.log(
        `${get("fast_forward")} Skipped: ${path.relative(
          targetDir,
          file
        )} (no comment to remove)`
      );
    }
  }

  return stats;
}
