export const COMMENT_PATTERNS = {
  // Single-line comments way dy look like this: (// ...)
  SINGLE_LINE: /\/\/.*$/gm,

  // Multi-line comments excluding JSDoc way dy like this: (/* ... */)
  MULTI_LINE_NON_JSDOC: /\/\*(?!\*)([\s\S]*?)\*\//g,

  // All multi-line comments plus JSDoc join [orishirishi]
  MULTI_LINE_ALL: /\/\*([\s\S]*?)\*\//g,

  // HTML-style comments way dy like this: (<!-- ... -->)
  HTML_COMMENTS: /<!--[\s\S]*?-->/g,

  // Extra whitespace cleanup
  EMPTY_LINES: /^\s*\n/gm,
} as const;
