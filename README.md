# Hexput Blockly

This project provides a Blockly integration for the Hexput programming language. It allows visual programming through custom blocks that generate Hexput code, making it easier to create Hexput programs without writing code directly.

## Installation

To install the module, use npm:

```bash
npm install hexput-blockly
```

## Usage

To use Hexput Blockly in your project, import it and initialize the Blockly environment:

```typescript
import Blockly from 'blockly';
import { initBlockly } from 'hexput-blockly';

// Initialize Blockly with your container ID and optional toolbox
initBlockly(Blockly, 'blocklyDiv', yourToolboxDefinition);
```

## Generating Hexput Code

After creating blocks in the Blockly workspace, you can generate Hexput code:

```typescript
import Blockly from 'blockly';

// Get the workspace
const workspace = Blockly.getMainWorkspace();

// Generate Hexput code
const code = Blockly.Hexput.workspaceToCode(workspace);
console.log(code);
```

## Custom Blocks

Hexput Blockly provides many custom blocks for the Hexput language:

### Variables and Literals
- Variable declaration (`vl varName = value`)
- Number, string, and boolean literals
- Variable references

### Arrays and Objects
- Array creation with items
- Object creation with properties
- Array and object property access (dot and bracket notation)

### Operators
- Mathematical operations (addition, subtraction, multiplication, division)
- Comparison operators (equals, not equals, greater than, less than, etc.)
- Logical operators (and, or, not)

### Control Flow
- If statements
- Loop statements

### Functions
- Function calls with parameters

### Example

Here's an example of using blocks to define a variable and perform operations:

```typescript
// In Blockly this would be visual blocks generating:
vl myNumber = 42;
vl myString = "Hello, world!";
vl myResult = myNumber + 10;

if myResult > 50 {
  vl message = myString + " The result is greater than 50!";
}

loop item in [1, 2, 3] {
  vl doubled = item * 2;
}
```

## Custom Block Definition

To define new blocks for Hexput Blockly, you can extend the module with your own block definitions:

```typescript
import Blockly from 'blockly';
import { initBlockly, generateHexputBlockly } from 'hexput-blockly';

// Define your custom block
Blockly.Blocks['my_custom_block'] = {
  init: function() {
    // Block definition logic
  }
};

// Define the generator for your custom block
const hexputGenerator = generateHexputBlockly(Blockly);
hexputGenerator.forBlock['my_custom_block'] = function(block) {
  // Code generation logic
  return 'my custom hexput code';
};
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.