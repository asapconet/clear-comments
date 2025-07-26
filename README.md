# clear-comments

A fast and simple CLI tool to remove comments from your React/JavaScript projects.

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

**Using with npx (no installation required):**
```bash
npx clear-comments
npx clear-comments ./src --verbose
```

### Programmatic Usage (TypeScript/JavaScript)

```typescript
import { clearComments, removeComments } from 'clear-comments';

// Clear comments in entire project with options
const stats = await clearComments({
  targetDir: './src',
  verbose: true,
  preserveJSDoc: true,
  excludePatterns: ['**/generated/**']
});

console.log(`Processed ${stats.processedFiles} files`);

// Remove comments from a string
const cleanCode = removeComments(sourceCode, '.tsx', true);
```

```javascript
// CommonJS usage
const { clearComments, removeComments } = require('clear-comments');

// Same API as above
```

## Features

- ✅ Removes single-line comments (`// comment`)
- ✅ Removes multi-line comments (`/* comment */`)
- ✅ Removes JSX comments (`{/* comment */}`)
- ✅ Removes HTML comments (`<!-- comment -->`)
- ✅ Preserves JSDoc comments (`/** comment */`)
- ✅ Supports JavaScript (`.js`)
- ✅ Supports TypeScript (`.ts`)
- ✅ Supports JSX (`.jsx`)
- ✅ Supports TSX (`.tsx`)
- ✅ Automatically excludes `node_modules`, `dist`, `build` directories
- ✅ Fast processing with glob patterns

## Supported File Types

- `.js` - JavaScript files
- `.jsx` - React JSX files
- `.ts` - TypeScript files
- `.tsx` - TypeScript JSX files

## Examples

### Before
```javascript
// This is a component
function MyComponent() {
  /* State management */
  const [count, setCount] = useState(0); // Counter state
  
  return (
    <div>
      {/* JSX comment */}
      <h1>Count: {count}</h1>
      <!-- HTML comment -->
    </div>
  );
}
```

### After
```javascript
function MyComponent() {
  
  const [count, setCount] = useState(0); 
  
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
git clone https://github.com/your-username/clear-comments.git
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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Aaron Sunday

## Changelog

### 1.0.0
- Initial release
- Support for JS, JSX, TS, TSX files
- CLI interface
- Programmatic API