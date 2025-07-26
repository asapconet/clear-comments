import { SupportedExtension } from "../config/constants";
import { COMMENT_PATTERNS } from "../config/regexMatcher";

export function removeComments(
  content: string,
  fileExtension: SupportedExtension,
  preserveJSDoc = true
): string {
  let processedContent = content;
  processedContent = processedContent.replace(COMMENT_PATTERNS.SINGLE_LINE, "");
  if (preserveJSDoc) {
    processedContent = processedContent.replace(
      COMMENT_PATTERNS.MULTI_LINE_NON_JSDOC,
      ""
    );
  } else {
    processedContent = processedContent.replace(
      COMMENT_PATTERNS.MULTI_LINE_ALL,
      ""
    );
  }
  if (fileExtension === ".jsx" || fileExtension === ".tsx") {
    processedContent = processedContent.replace(
      COMMENT_PATTERNS.HTML_COMMENTS,
      ""
    );
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
