import { SupportedExtension } from "../config/constants";
import { COMMENT_PATTERNS } from "../config/regexMatcher";
import { CommentType } from "../types";

export function removeComments(
  content: string,
  fileExtension: SupportedExtension,
  removeTypes: CommentType[] = ["single-line", "multi-line", "html"],
  customPatterns: string[] = []
): string {
  let processedContent = content;

  if (removeTypes.includes("single-line")) {
    processedContent = processedContent.replace(
      COMMENT_PATTERNS.SINGLE_LINE,
      ""
    );
  }

  if (removeTypes.includes("multi-line")) {
    if (removeTypes.includes("jsdoc")) {
      processedContent = processedContent.replace(
        COMMENT_PATTERNS.MULTI_LINE_ALL,
        ""
      );
    } else {
      processedContent = processedContent.replace(
        COMMENT_PATTERNS.MULTI_LINE_NON_JSDOC,
        ""
      );
    }
  }

  if (
    removeTypes.includes("html") &&
    (fileExtension === ".jsx" || fileExtension === ".tsx")
  ) {
    processedContent = processedContent.replace(
      COMMENT_PATTERNS.HTML_COMMENTS,
      ""
    );
  }

  for (const pattern of customPatterns) {
    try {
      const regex = new RegExp(pattern, "g");
      processedContent = processedContent.replace(regex, "");
    } catch (error) {
      console.warn(`Invalid custom pattern: ${pattern}`);
    }
  }

  processedContent = processedContent.replace(COMMENT_PATTERNS.EMPTY_LINES, "");

  return processedContent;
}

export function isSupportedExtension(
  extension: string
): extension is SupportedExtension {
  const supportedExts: readonly string[] = [".js", ".jsx", ".ts", ".tsx"];
  return supportedExts.includes(extension);
}

export function convertLegacyOptions(preserveJSDoc?: boolean): CommentType[] {
  if (preserveJSDoc === false) {
    return ["single-line", "multi-line", "html", "jsdoc"];
  }
  return ["single-line", "multi-line", "html"];
}
