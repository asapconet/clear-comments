import { getFilesToProcess, processFiles } from "./fileProcessor";
import { DEFAULT_OPTIONS } from "../config/constants";
import { ClearCommentsOptions, ProcessingStats } from "../types";
import { get } from "node-emoji";

// This big guy dey run the main show to clear comments from the whole project
export async function clearComments(
  options: ClearCommentsOptions = {}
): Promise<ProcessingStats> {
  const {
    targetDir = DEFAULT_OPTIONS.targetDir,
    excludePatterns = DEFAULT_OPTIONS.excludePatterns,
    verbose = DEFAULT_OPTIONS.verbose,
    preserveJSDoc = DEFAULT_OPTIONS.preserveJSDoc,
  } = options;

  // If you wan make am loud, e go show you wetin e dy do with some emoji swag
  if (verbose) {
    console.log(
      `${get("broom")} Clearing comments from project in: ${targetDir}`
    );
    console.log(
      `${get("clipboard")} Keep JSDoc? ${preserveJSDoc ? "Yes" : "No"}`
    );
  }

  try {
    // This one dy gather all the files wey we go work on
    const excludePatterns = [
      ...(options.excludePatterns ?? DEFAULT_OPTIONS.excludePatterns),
    ];

    const files = await getFilesToProcess(targetDir, excludePatterns);

    // Now we dey process all those files sharp
    const stats = await processFiles(files, targetDir, {
      preserveJSDoc,
      verbose,
      excludePatterns,
    });

    return stats;
  } catch (error) {
    // If something scatter, we go catch am and report the mata
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      totalFiles: 0,
      processedFiles: 0,
      totalLinesRemoved: 0,
      //  If big bege dy groud?
      errors: [`Global error:: ${errorMessage}`],
    };
  }
}
