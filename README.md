# Clear Comments

A fast and focused CLI tool to remove comments from your React/JavaScript projects.

## 🎯 Why Clear Comments?

### **Perfect For:**

- **Client Deliveries**: Ship clean, professional code without internal comments
- **Production Builds**: Remove comments before deployment when bundlers aren't suitable
- **Educational Materials**: Create clean code examples for tutorials or documentation
- **Open Source Releases**: Prepare polished versions without development comments
- **Legacy Projects**: Clean up codebases where modern build tools aren't integrated
- **Quick Cleanup**: Simple comment removal without complex build pipeline setup

### **Real Value:**

- ⚡ **Fast Processing**: Handles large codebases in seconds
- 🎯 **Surgical Precision**: Removes only comments, preserves JSDoc by default
- 🔧 **Zero Configuration**: Works out of the box with sensible defaults
- 📦 **Lightweight**: Single-purpose tool without bloat
- 🚀 **Build Integration**: Easy to integrate into existing workflows

## ⚠️ Important Considerations

**You might NOT need this tool if:**

- ✅ Your bundler (Webpack, Vite, Rollup) already handles comment removal
- ✅ You're using minification tools (Terser, UglifyJS) in your build process
- ✅ Comments are valuable for code maintenance in your workflow
- ✅ You have a comprehensive build pipeline that handles this

**This tool is designed for specific use cases where existing solutions don't fit your needs.**

## Installation

### Global Installation (Recommended)

```bash
npm install -g clear-comments
```

### Local Installation

```bash
npm install clear-comments --save-dev
```

## Usage

### Command Line

**Clear comments in current directory:**

```bash
clear-comments
```

**Clear comments in specific directory:**

```bash
clear-comments ./src
```

**With verbose output:**

```bash
clear-comments --verbose
clear-comments ./src -v
```

**Remove JSDoc comments too:**

```bash
clear-comments --no-jsdoc
```

**Remove all extra empty lines:**

```bash
clear-comments ./src --no-jsdoc --remove-empty-lines true
```

**Show help:**

```bash
clear-comments --help
```

**Using with npx (no installation required):**

```bash
npx clear-comments
npx clear-comments ./src --verbose
```

### Build Integration Examples

**In package.json scripts:**

```json
{
  "scripts": {
    "clean-code": "clear-comments ./src",
    "prebuild": "clear-comments ./src --no-jsdoc",
    "prepare-delivery": "clear-comments ./dist --verbose"
  }
}
```

**In CI/CD pipeline:**

```yaml
- name: Clean comments for production
  run: npx clear-comments ./src --no-jsdoc
```

### Programmatic Usage (TypeScript/JavaScript)

```typescript
import { clearComments, removeComments } from 'clear-comments';

// Clear comments in entire project with options
const stats = await clearComments({
  targetDir: './src',
  verbose: true,
  preserveJSDoc: true,
  removeEmptyLines:false,
  excludePatterns: ['**/generated/**']
});

console.log(`Processed ${stats.processedFiles} files`);
console.log(`Removed ${stats.totalLinesRemoved} lines of comments`);

// Remove comments from a string
const cleanCode = removeComments(sourceCode, '.tsx', true {
  removeEmptyLines: true
});
```

```javascript
// CommonJS usage
const { clearComments, removeComments } = require("clear-comments");

// Same API as above
```

## Features

- ✅ Removes single-line comments (`// comment`)
- ✅ Removes multi-line comments (`/* comment */`)
- ✅ Removes JSX comments (`{/* comment */}`)
- ✅ Removes HTML comments (`<!-- comment -->`)
- ✅ Preserves empty lines by default ✅ (new)
- ✅ Preserves JSDoc comments (`/** comment */`) by default
- ✅ Supports JavaScript (`.js`)
- ✅ Supports TypeScript (`.ts`)
- ✅ Supports JSX (`.jsx`)
- ✅ Supports TSX (`.tsx`)
- ✅ Automatically excludes `node_modules`, `dist`, `build` directories
- ✅ Fast processing with glob patterns
- ✅ Detailed statistics and error reporting
- ✅ Configurable exclusion patterns

## Supported File Types

- `.js` - JavaScript files
- `.jsx` - React JSX files
- `.ts` - TypeScript files
- `.tsx` - TypeScript JSX files

## Use Cases & Examples

### **Client Delivery Scenario**

```bash
# Before delivering to client, clean up internal comments
clear-comments ./project-src --verbose
# ✅ Cleaned: 47 files, removed 312 lines of comments
```

### **Educational Content Preparation**

```bash
# Prepare clean examples for tutorial
clear-comments ./tutorial-code --no-jsdoc
# Creates clean, distraction-free code examples
```

### **Legacy Project Cleanup**

```bash
# Clean up old codebase before modernization
clear-comments ./legacy-app --verbose
# Removes outdated comments while preserving JSDoc
```

### Code Transformation Example

**Before:**

```javascript
// This is a component for user authentication [comment way we go comot]
function MyComponent() {
  /* State management for login form [comment way we go comot] */
  const [count, setCount] = useState(0); // Counter state [comment way we go comot]

  /**
   * Handles user login
   * @param credentials User login data
   */
  const handleLogin = (credentials) => {
    // TODO: Add validation [comment way go comot]
    return authenticate(credentials);
  };

  return (
    <div>
      {/* JSX comment - login form [comment way go comot]*/}
      <h1>Count: {count}</h1>
      <!-- HTML comment (shouldn't be here) -->
    </div>
  );
}
```

**After (with JSDoc preservation):**

```javascript
function MyComponent() {
  const [count, setCount] = useState(0);

  /**
   * Handles user login [comment way no we no comot]
   * @param credentials User login data
   */
  const handleLogin = (credentials) => {
    return authenticate(credentials);
  };

  return (
    <div>
      <h1>Count: {count}</h1>
    </div>
  );
}
```

## Development

### Setup

```bash
git clone https://github.com/asapcone/clear-comments.git
cd clear-comments
npm install
```

### Build

```bash
npm run build
```

### Development Mode (watch for changes)

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

### Clean Build Artifacts

```bash
npm run clean
```

## CLI Options

| Option          | Description                     | Default           |
| --------------- | ------------------------------- | ----------------- |
| `directory`     | Target directory to process     | Current directory |
| `--verbose, -v` | Show detailed processing output | `false`           |
| `--no-jsdoc`    | Remove JSDoc comments as well   | Preserves JSDoc   |
| `--help, -h`    | Show help information           | -                 |
| `--remove-empty-lines [true false]`  | Preserve or remove blank lines | False |

## Programmatic API

### `clearComments(options)`

Main function to process files in a directory.

**Options:**

- `targetDir?: string` - Directory to process
- `preserveJSDoc?: boolean` - Keep JSDoc comments (default: true)
- `verbose?: boolean` - Detailed logging (default: false)
- `excludePatterns?: string[]` - Additional exclusion patterns

**Returns:** `Promise<ProcessingStats>`

### `removeComments(content, extension, preserveJSDoc)`

Remove comments from a string of code.

**Parameters:**

- `content: string` - Source code content
- `extension: '.js' | '.jsx' | '.ts' | '.tsx'` - File extension
- `preserveJSDoc: boolean` - Whether to preserve JSDoc

**Returns:** `string` - Cleaned content

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Add tests for new functionality
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Roadmap

- [ ] Configuration file support (`.clearrc`)
- [ ] Backup functionality before processing
- [ ] Custom comment pattern support
- [ ] Integration with popular bundlers
- [ ] Performance improvements for very large codebases

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Aaron Sunday**

- GitHub: [@asapconet](https://github.com/asapconet)

## Changelog

### 0.1.2 (Latest)

- 🆕 Remove  Empty Lines by Default

- ➕ Added --preserve-empty-lines CLI option

- 🛠 Improved merging of CLI options and config

### 0.1.1

- 🔧 Update executable file

### 0.1.0

- Initial release
- Support for JS, JSX, TS, TSX files
- CLI interface with verbose mode
- Programmatic API
- JSDoc preservation option
- Comprehensive test suite
- TypeScript implementation with modular architecture

---

💡 **Need help?** Open an issue on GitHub or check out the examples above.

🤝 **Found this useful?** Star the repo and share with your team!
