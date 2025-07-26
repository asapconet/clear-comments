// Omo, this file na HOT ZONE o!
// No even try to touch or format am,
// unless you wan make I pursue your generation!

import { SupportedExtension } from "../config/constants";

export type TestCase = {
  name: string;
  input: string;
  expected: string;
  extension: SupportedExtension;
  preserveJSDoc?: boolean;
  customPatterns?: string[];
  beforeEach?: (path: string, content: string) => void;
  afterEach?: (path: string) => void;
  testRestore?: boolean;
};

export const tests: TestCase[] = [
  {
    name: "Single line comments in JavaScript",
    extension: ".js",
    input: `
    const hello = 'world'; // This is a comment
    const foo = 'bar'; // Another comment`,
    expected: `
    const hello = 'world'; 
    const foo = 'bar';`,
  },
  {
    name: "Multi-line comments in TypeScript",
    extension: ".ts",
    input: `/* This is a comment */
    const hello: string = 'world';
    /* Another multi-line comment */
    const foo: string = 'bar';`,
    expected: `
    const hello: string = 'world';
    const foo: string = 'bar';`,
  },
  {
    name: "JSDoc preservation (default behavior)",
    extension: ".ts",
    preserveJSDoc: true,
    input: `/**
    * This is JSDoc - should be preserved
    * @param name The name parameter
    */
    function greet(name: string): string {
    /* This comment should be removed */
    return \`Hello \${name}\`; // This too
    }`,
    expected: `/**
    * This is JSDoc - should be preserved
    * @param name The name parameter
    */
    function greet(name: string): string {
    return \`Hello \${name}\`; 
    }`,
  },
  {
    name: "JSDoc removal when disabled",
    extension: ".ts",
    preserveJSDoc: false,
    input: `/**
    * This JSDoc should be removed
    * @param name The name parameter
    * */
    function greet(name: string): string {
    return \`Hello \${name}\`;
    }`,
    expected: `
    function greet(name: string): string {
    return \`Hello \${name}\`;
    }`,
  },
  {
    name: "JSX with mixed comments",
    extension: ".jsx",
    input: `
    // React component
    function Component() {
    return (
    <div>
    {/* JSX comment */}
      <h1>Hello World</h1>
    <!-- HTML comment -->
      <p>Content</p>
    </div>
    );
    }`,
    expected: `
    function Component() {
    return (
    <div>
    {}
      <h1>Hello World</h1>
      <p>Content</p>
    </div>
    );
    }`,
  },
  {
    name: "TSX with TypeScript and JSX comments",
    extension: ".tsx",
    input: `
    // TypeScript React component
    interface Props {
    name: string;// Name prop
    }

    const Component: React.FC<Props> = ({ name }) => {
    
    /* Component logic */
    return (
    <div>
    {/* Display name */}
    <h1>Hello {name}</h1>
    <!-- This shouldn't be here but let's handle it -->
    </div>
    );
    };`,
    expected: `
    interface Props {
    name: string;
    }
    const Component: React.FC<Props> = ({ name }) => {
    return (
    <div>
    {}
    <h1>Hello {name}</h1>
    </div>
    );
    };`,
  },
  {
    name: "Complex nested comments",
    extension: ".js",
    input: `
    function complex() {
    // Start of function
    const data = {
    // Object properties
    key: 'value', // String value
    /* Multi-line
       comment here */
    number: 42 // Number value
    };

    /* Processing logic
      goes here */
    return data; // Return the data
    }`,
    expected: `
    function complex() {
    const data = {
    key: 'value', 
    number: 42 
    };
    return data; 
    }`,
  },

  {
    name: "Restore brings back original file",
    extension: ".ts",
    input: `/* remove this */ const b: number = 2;`,
    expected: `const b: number = 2;`,
    testRestore: true,
  },
];
