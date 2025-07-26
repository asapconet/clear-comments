import { clearComments } from "./core";
import { removeComments, isSupportedExtension } from "./core/commentRemover";
import { processFile, processFiles } from "./core/fileProcessor";
import { cli } from "./cli/cli";
import { ClearCommentsOptions, ProcessingStats } from "./types";
import { logError } from "./utils/logger";

export { clearComments };
export { removeComments };
export { processFile };
export { processFiles };
export { isSupportedExtension };
export { cli };

export type { ClearCommentsOptions, ProcessingStats };

// If na direct call, we go run the CLI sharp sharp
if (require.main === module) {
  cli().catch((error) => {
    logError(
      `Omo, something scatter o: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    process.exit(1);
  });
}
