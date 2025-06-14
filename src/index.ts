import type Blockly from 'blockly';
import type { Workspace } from 'blockly'; 
import type { ToolboxDefinition } from 'blockly/core/utils/toolbox';
import { HexputGenerator } from './types/HexputGenerator';

// Function to initialize the Blockly environment
export function initBlockly(blockly: typeof Blockly, container: Element | string, toolboxDefinition?: string | Element | ToolboxDefinition): Workspace | undefined {
    // Find the container element
    container = (typeof container == "string" ?  document.getElementById(container) : container) as any;
    if (!container) {
        console.error(`Container element with ID '${container}' not found.`);
        return;
    }
    
    // Configure toolbox
    let toolbox;
    if (toolboxDefinition) {
        toolbox = toolboxDefinition;
    } else {
        // Try to get the toolbox element from the document
        const toolboxElement = document.getElementById('toolbox');
        if (toolboxElement) {
            toolbox = toolboxElement;
        } else {
            console.warn("No toolbox element found with ID 'toolbox'. Using empty toolbox.");
            toolbox = '<xml></xml>'; // Empty toolbox
        }
    }

    // Define block types first
    defineBlockTypes(blockly);
    
    // Create the Hexput generator first
    const hexputGenerator = generateHexputBlockly(blockly);
    
    // Register the generator with Blockly
    //@ts-ignore
    blockly.Hexput = hexputGenerator;
    
    // Register all custom blocks with the generator
    registerCustomBlocks(hexputGenerator);

    // Initialize Blockly with the proper toolbox configuration
    const workspace = blockly.inject(container, {
        toolbox: toolbox,
        // You can add other default options here
        trashcan: true,
        scrollbars: true,
    });

    return workspace;
}

/**
 * Generate a Hexput language generator for Blockly
 * @param blockly The Blockly instance to use
 * @returns A configured generator for the Hexput language
 */
export function generateHexputBlockly(blockly: typeof Blockly): HexputGenerator {
    // Create a new generator instance
    const hexputGenerator = ((blockly as any).Hexput || new blockly.Generator('Hexput')) as unknown as HexputGenerator;
    
    // Initialize Hexput generator with appropriate settings
    hexputGenerator.init = function(workspace: Workspace) {
        // Any initialization logic specific to Hexput
    };
    
    // Finish code generation
    hexputGenerator.finish = function(code: string) {
        const lines = code.split('\n');
        const processedLines = lines.map(line => {
            // Skip empty lines or lines that just contain whitespace
            if (!line.trim()) return line;
            
            // Skip lines that already end with semicolon, curly braces, or are block ends
            if (/[;{}]\s*$/.test(line) || line.trim().endsWith('}')) return line;
            
            // Add semicolon to the line if it has actual code content
            return line + ';';
        });
        
        return processedLines.join('\n');
    };
    
    // Define how blocks are converted to code
    //@ts-ignore
    hexputGenerator.scrub_ = function(block, code, opt_thisOnly) {
        const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
        const nextCode = opt_thisOnly ? '' : hexputGenerator.blockToCode(nextBlock);
        return code + nextCode;
    };
    
    // Define order constants explicitly with numeric values
    // These values match those used in Blockly's JavaScript generator
    hexputGenerator.ORDER_ATOMIC = 0;         // 0 - No operations (literals, variables)
    hexputGenerator.ORDER_ADDITION = 13;      // 13 - + and -
    hexputGenerator.ORDER_SUBTRACTION = 13;   // 13 - + and -
    hexputGenerator.ORDER_MULTIPLICATION = 14; // 14 - * and /
    hexputGenerator.ORDER_DIVISION = 14;      // 14 - * and /
    hexputGenerator.ORDER_ASSIGNMENT = 3;     // 3 - =
    hexputGenerator.ORDER_COMMA = 0;          // 0 - ,
    hexputGenerator.ORDER_MEMBER = 2;         // 2 - . (member access)
    hexputGenerator.ORDER_FUNCTION_CALL = 2;  // 2 - ()
    hexputGenerator.ORDER_LOGICAL_AND = 6;    // 6 - && 
    hexputGenerator.ORDER_LOGICAL_OR = 5;     // 5 - ||
    hexputGenerator.ORDER_NONE = 99;          // 99 - (...)
    hexputGenerator.ORDER_LOGICAL_NOT = 7;    // 7 - !
    hexputGenerator.ORDER_RELATIONAL = 11;    // 11 - < <= > >=
    hexputGenerator.ORDER_EQUALITY = 10;      // 10 - == != === !==
    
    return hexputGenerator;
}

/**
 * Define all block types used in Hexput
 * @param blockly The Blockly instance to use
 */
function defineBlockTypes(blockly: typeof Blockly): void {
    // Variable declaration block
    blockly.Blocks['variable_declaration'] = {
        init: function() {
            this.jsonInit({
                type: 'variable_declaration',
                message0: 'vl %1 = %2',
                args0: [
                    {
                        type: 'field_input',
                        name: 'VAR_NAME',
                        text: 'varName'
                    },
                    {
                        type: 'input_value',
                        name: 'VALUE',
                        check: null // Accept any type of input
                    }
                ],
                previousStatement: null,
                nextStatement: null,
                colour: 230,
                tooltip: 'Declare a variable with the vl keyword',
                helpUrl: ''
            });
        }
    };
    // Number literal block
    blockly.Blocks['number_literal'] = {
        init: function() {
            this.jsonInit({
                type: 'number_literal',
                message0: '%1',
                args0: [
                    {
                        type: 'field_number',
                        name: 'NUM',
                        value: 0
                    }
                ],
                output: 'Number',
                colour: 160,
                tooltip: 'A number value',
                helpUrl: ''
            });
        }
    };

    // String literal block
    blockly.Blocks['string_literal'] = {
        init: function() {
            this.jsonInit({
                type: 'string_literal',
                message0: '"%1"',
                args0: [
                    {
                        type: 'field_input',
                        name: 'TEXT',
                        text: ''
                    }
                ],
                output: 'String',
                colour: 160,
                tooltip: 'A string value',
                helpUrl: ''
            });
        }
    };

    // Boolean literal block
    blockly.Blocks['boolean_literal'] = {
        init: function() {
            this.jsonInit({
                type: 'boolean_literal',
                message0: '%1',
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'BOOL',
                        options: [
                            ['true', 'true'],
                            ['false', 'false']
                        ]
                    }
                ],
                output: 'Boolean',
                colour: 160,
                tooltip: 'A boolean value (true or false)',
                helpUrl: ''
            });
        }
    };

    // Any value concatenation block
    blockly.Blocks['any_concat'] = {
        init: function() {
            this.jsonInit({
                type: 'any_concat',
                message0: '%1 + %2',
                args0: [
                    {
                        type: 'field_input',
                        name: 'A',
                        check: null  // Accept any type
                    },
                    {
                        type: 'field_input',
                        name: 'B',
                        check: null  // Accept any type
                    }
                ],
                output: null,
                colour: 160,
                tooltip: 'Concatenate any two values',
                helpUrl: ''
            });
        }
    };

    // Math subtract block
    blockly.Blocks['math_subtract'] = {
        init: function() {
            this.jsonInit({
                type: 'math_subtract',
                message0: '%1 - %2',
                args0: [
                    {
                        type: 'field_input',
                        name: 'A',
                        check: null  // Accept any type
                    },
                    {
                        type: 'field_input',
                        name: 'B',
                        check: null  // Accept any type
                    }
                ],
                output: null,
                colour: 160,
                tooltip: 'Subtract two values',
                helpUrl: ''
            });
        }
    };

    // Math multiply block
    blockly.Blocks['math_multiply'] = {
        init: function() {
            this.jsonInit({
                type: 'math_multiply',
                message0: '%1 × %2',
                args0: [
                    {
                        type: 'field_input',
                        name: 'A',
                        check: null  // Accept any type
                    },
                    {
                        type: 'field_input',
                        name: 'B',
                        check: null  // Accept any type
                    }
                ],
                output: null,
                colour: 160,
                tooltip: 'Multiply two values',
                helpUrl: ''
            });
        }
    };

    // Math divide block
    blockly.Blocks['math_divide'] = {
        init: function() {
            this.jsonInit({
                type: 'math_divide',
                message0: '%1 ÷ %2',
                args0: [
                    {
                        type: 'field_input',
                        name: 'A',
                        check: null  // Accept any type
                    },
                    {
                        type: 'field_input',
                        name: 'B',
                        check: null  // Accept any type
                    }
                ],
                output: null,
                colour: 160,
                tooltip: 'Divide two values',
                helpUrl: ''
            });
        }
    };

    // Return statement block
    blockly.Blocks['return_statement'] = {
        init: function() {
            this.jsonInit({
                type: 'return_statement',
                message0: 'res %1',
                args0: [
                    {
                        type: 'input_value', // Changed from field_input
                        name: 'VALUE',       // Renamed from VAR_NAME for clarity
                        check: null          // Accept any type of input
                    }
                ],
                previousStatement: null,
                nextStatement: null,
                colour: 20, // A distinct color for return statements
                tooltip: 'Return a value from a function or script.',
                helpUrl: ''
            });
        }
    };

    // Array literal block
    blockly.Blocks['array_literal'] = {
        init: function() {
            this.jsonInit({
                type: 'array_literal',
                message0: 'List %1',
                args0: [
                    {
                        type: 'input_statement',
                        name: 'ITEMS',
                        check: 'ArrayItem'
                    }
                ],
                output: 'Array',
                colour: 290,
                tooltip: 'Create an array',
                helpUrl: ''
            });
        }
    };

    // Array item block
    blockly.Blocks['array_item'] = {
        init: function() {
            this.jsonInit({
                type: 'array_item',
                message0: '%1',
                args0: [
                    {
                        type: 'input_value',
                        name: 'VALUE',
                        check: null
                    }
                ],
                previousStatement: 'ArrayItem',
                nextStatement: 'ArrayItem',
                colour: 290,
                tooltip: 'Item in an array',
                helpUrl: ''
            });
        }
    };

    // Object literal block
    blockly.Blocks['object_literal'] = {
        init: function() {
            this.jsonInit({
                type: 'object_literal',
                message0: 'Object %1',
                args0: [
                    {
                        type: 'input_statement',
                        name: 'PROPERTIES',
                        check: 'ObjectProperty'
                    }
                ],
                output: 'Object',
                colour: 210,
                tooltip: 'Create an object',
                helpUrl: ''
            });
        }
    };

    // Object property block
    blockly.Blocks['object_property'] = {
        init: function() {
            this.jsonInit({
                type: 'object_property',
                message0: '%1 : %2',
                args0: [
                    {
                        type: 'field_input',
                        name: 'PROP_NAME',
                        text: 'property'
                    },
                    {
                        type: 'input_value',
                        name: 'VALUE',
                        check: null
                    }
                ],
                previousStatement: 'ObjectProperty',
                nextStatement: 'ObjectProperty',
                colour: 210,
                tooltip: 'Property in an object',
                helpUrl: ''
            });
        }
    };

    // Variable reference block
    blockly.Blocks['variable_reference'] = {
        init: function() {
            this.jsonInit({
                type: 'variable_reference',
                message0: '%1',
                args0: [
                    {
                        type: 'field_input',
                        name: 'VAR_NAME',
                        text: 'varName'
                    }
                ],
                output: null,
                colour: 230,
                tooltip: 'Reference a variable by name',
                helpUrl: ''
            });
        }
    };

    // If statement block
    blockly.Blocks['if_statement'] = {
        init: function() {
            this.jsonInit({
                type: 'if_statement',
                message0: 'if %1',
                args0: [
                    {
                        type: 'input_value',
                        name: 'CONDITION',
                        check: null
                    }
                ],
                message1: '%1',
                args1: [
                    {
                        type: 'input_statement',
                        name: 'DO'
                    }
                ],
                previousStatement: null,
                nextStatement: null,
                colour: 210,
                tooltip: 'If statement - executes the block if the condition is true',
                helpUrl: ''
            });
        }
    };

    // Logical AND - updating to use inputs on both sides
    blockly.Blocks['logic_and'] = {
        init: function() {
            this.appendValueInput('A')
                .setCheck(null);
            this.appendValueInput('B')
                .setCheck(null)
                .appendField('and');
            this.setInputsInline(true);
            this.setOutput(true, 'Boolean');
            this.setColour(210);
            this.setTooltip('Logical AND operator');
            this.setHelpUrl('');
        }
    };

    // Logical OR - updating to use inputs on both sides
    blockly.Blocks['logic_or'] = {
        init: function() {
            this.appendValueInput('A')
                .setCheck(null);
            this.appendValueInput('B')
                .setCheck(null)
                .appendField('or');
            this.setInputsInline(true);
            this.setOutput(true, 'Boolean');
            this.setColour(210);
            this.setTooltip('Logical OR operator');
            this.setHelpUrl('');
        }
    };

    // Logical NOT - keep as is but with modified English
    blockly.Blocks['logic_not'] = {
        init: function() {
            this.appendValueInput('BOOL')
                .setCheck(null)
                .appendField('not');
            this.setOutput(true, 'Boolean');
            this.setColour(210);
            this.setTooltip('Logical NOT operator');
            this.setHelpUrl('');
        }
    };

    // Comparison operators - all using inputs on both sides
    blockly.Blocks['comparison_gt'] = {
        init: function() {
            this.appendValueInput('A')
                .setCheck(null);
            this.appendValueInput('B')
                .setCheck(null)
                .appendField('greater than');
            this.setInputsInline(true);
            this.setOutput(true, 'Boolean');
            this.setColour(210);
            this.setTooltip('Greater than comparison');
            this.setHelpUrl('');
        }
    };
    
    // Update comparison operators to use inputs on both sides
    blockly.Blocks['comparison_lt'] = {
        init: function() {
            this.appendValueInput('A')
                .setCheck(null);
            this.appendValueInput('B')
                .setCheck(null)
                .appendField('less than');
            this.setInputsInline(true);
            this.setOutput(true, 'Boolean');
            this.setColour(210);
            this.setTooltip('Less than comparison');
            this.setHelpUrl('');
        }
    };
    
    blockly.Blocks['comparison_eq'] = {
        init: function() {
            this.appendValueInput('A')
                .setCheck(null);
            this.appendValueInput('B')
                .setCheck(null)
                .appendField('equals');
            this.setInputsInline(true);
            this.setOutput(true, 'Boolean');
            this.setColour(210);
            this.setTooltip('Equality comparison');
            this.setHelpUrl('');
        }
    };
    
    blockly.Blocks['comparison_neq'] = {
        init: function() {
            this.appendValueInput('A')
                .setCheck(null);
            this.appendValueInput('B')
                .setCheck(null)
                .appendField('not equal to');
            this.setInputsInline(true);
            this.setOutput(true, 'Boolean');
            this.setColour(210);
            this.setTooltip('Inequality comparison');
            this.setHelpUrl('');
        }
    };
    
    blockly.Blocks['comparison_gte'] = {
        init: function() {
            this.appendValueInput('A')
                .setCheck(null);
            this.appendValueInput('B')
                .setCheck(null)
                .appendField('greater than or equal to');
            this.setInputsInline(true);
            this.setOutput(true, 'Boolean');
            this.setColour(210);
            this.setTooltip('Greater than or equal comparison');
            this.setHelpUrl('');
        }
    };
    
    blockly.Blocks['comparison_lte'] = {
        init: function() {
            this.appendValueInput('A')
                .setCheck(null);
            this.appendValueInput('B')
                .setCheck(null)
                .appendField('less than or equal to');
            this.setInputsInline(true);
            this.setOutput(true, 'Boolean');
            this.setColour(210);
            this.setTooltip('Less than or equal comparison');
            this.setHelpUrl('');
        }
    };

    // Loop statement block
    blockly.Blocks['loop_statement'] = {
        init: function() {
            this.jsonInit({
                type: 'loop_statement',
                message0: 'loop %1 in %2',
                args0: [
                    {
                        type: 'field_input',
                        name: 'ITER_VAR',
                        text: 'item'
                    },
                    {
                        type: 'input_value',
                        name: 'ITERABLE',
                        check: null
                    }
                ],
                message1: '%1',
                args1: [
                    {
                        type: 'input_statement',
                        name: 'DO'
                    }
                ],
                previousStatement: null,
                nextStatement: null,
                colour: 120,
                tooltip: 'Loop through items in a collection',
                helpUrl: ''
            });
        }
    };

    // Object property access using dot notation
    blockly.Blocks['object_property_access'] = {
        init: function() {
            this.appendValueInput('OBJECT')
                .setCheck(null);
            this.appendDummyInput()
                .appendField(".")
                .appendField(new blockly.FieldTextInput("property"), "PROPERTY");
            this.setInputsInline(true);
            this.setOutput(true, null);
            this.setColour(210);
            this.setTooltip('Access an object property using dot notation');
            this.setHelpUrl('');
        }
    };

    // Object property access using bracket notation
    blockly.Blocks['object_bracket_access'] = {
        init: function() {
            this.appendValueInput('OBJECT')
                .setCheck(null);
            this.appendValueInput('PROPERTY')
                .setCheck(null)
                .appendField("[");
            this.appendDummyInput()
                .appendField("]");
            this.setInputsInline(true);
            this.setOutput(true, null);
            this.setColour(210);
            this.setTooltip('Access an object property using bracket notation');
            this.setHelpUrl('');
        }
    };

    // Array index access
    blockly.Blocks['array_index_access'] = {
        init: function() {
            this.appendValueInput('ARRAY')
                .setCheck(null);
            this.appendValueInput('INDEX')
                .setCheck('Number')
                .appendField("[");
            this.appendDummyInput()
                .appendField("]");
            this.setInputsInline(true);
            this.setOutput(true, null);
            this.setColour(290);
            this.setTooltip('Access an array element by index');
            this.setHelpUrl('');
        }
    };

    // Function call block - modified to accept any value as function name
    blockly.Blocks['function_call'] = {
        init: function() {
            this.appendValueInput("FUNCTION_NAME")
                .setCheck(null)
                .appendField("call");
            this.setOutput(true, null);
            this.setNextStatement(true, "FunctionParams");
            this.setColour(160);
            this.setTooltip('Call a function');
            this.setHelpUrl('');
        }
    };

    // Separate function parameters block
    blockly.Blocks['function_params'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("with parameters");
            this.appendStatementInput("PARAMS")
                .setCheck("FunctionParameter");
            this.setPreviousStatement(true, "FunctionParams");
            this.setColour(160);
            this.setTooltip('Add parameters to a function call');
            this.setHelpUrl('');
        }
    };

    // Function parameter block
    blockly.Blocks['function_parameter'] = {
        init: function() {
            this.appendValueInput("PARAM_VALUE")
                .setCheck(null);
            this.setPreviousStatement(true, "FunctionParameter");
            this.setNextStatement(true, "FunctionParameter");
            this.setColour(160);
            this.setTooltip('Parameter for a function call');
            this.setHelpUrl('');
        }
    };
}

/**
 * Adds a custom literal block to Blockly
 * @param blockly The Blockly instance
 * @param hexputGenerator The Hexput generator instance
 * @param literalLabel The display label for the block
 * @param literalValue The value to be used in code generation
 * @returns The name of the created block type
 */
export function addCustomLiteral(blockly: typeof Blockly, hexputGenerator: HexputGenerator, type: string, literalLabel: string, literalValue: string): string {
    // Define the block
    blockly.Blocks[type] = {
        init: function() {
            this.appendDummyInput()
                .appendField(literalLabel);
            this.setOutput(true, null);
            this.setColour(330);
            this.setTooltip(`Custom literal: ${literalLabel}`);
            this.setHelpUrl('');
        }
    };
    
    // Define the code generator
    if (!hexputGenerator.forBlock) {
        hexputGenerator.forBlock = {};
    }
    
    hexputGenerator.forBlock[type] = function(block: Blockly.Block) {
        return [literalValue, hexputGenerator.ORDER_ATOMIC];
    };
    
    return type;
}

/**
 * Register code generators for custom blocks
 * @param generator The generator to register the block generators on
 * @returns The modified generator with registered block handlers
 */
function registerCustomBlocks(generator: HexputGenerator): HexputGenerator {
    if (!generator.forBlock) {
        generator.forBlock = {};
    }
    
    // Code generators for Hexput language
    generator.forBlock['variable_declaration'] = function(block: Blockly.Block) {
        const varName = block.getFieldValue('VAR_NAME');
        const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ASSIGNMENT) || '""';
        return `vl ${varName} = ${value};\n`;
    };

    generator.forBlock['number_literal'] = function(block: Blockly.Block) {
        const number = block.getFieldValue('NUM');
        return [number, generator.ORDER_ATOMIC];
    };

    generator.forBlock['string_literal'] = function(block: Blockly.Block) {
        const text = block.getFieldValue('TEXT');
        return [`"${text}"`, generator.ORDER_ATOMIC];
    };

    generator.forBlock['boolean_literal'] = function(block: Blockly.Block) {
        const value = block.getFieldValue('BOOL');
        return [value, generator.ORDER_ATOMIC];
    };

    generator.forBlock['any_concat'] = function(block: Blockly.Block) {
        const valueA = generator.valueToCode(block, 'A', generator.ORDER_ADDITION) || '""';
        const valueB = generator.valueToCode(block, 'B', generator.ORDER_ADDITION) || '""';
        return [`${valueA} + ${valueB}`, generator.ORDER_ADDITION];
    };

    generator.forBlock['math_subtract'] = function(block: Blockly.Block) {
        const valueA = generator.valueToCode(block, 'A', generator.ORDER_SUBTRACTION) || '0';
        const valueB = generator.valueToCode(block, 'B', generator.ORDER_SUBTRACTION) || '0';
        return [`${valueA} - ${valueB}`, generator.ORDER_SUBTRACTION];
    };

    generator.forBlock['math_multiply'] = function(block: Blockly.Block) {
        const valueA = generator.valueToCode(block, 'A', generator.ORDER_MULTIPLICATION) || '0';
        const valueB = generator.valueToCode(block, 'B', generator.ORDER_MULTIPLICATION) || '0';
        return [`${valueA} * ${valueB}`, generator.ORDER_MULTIPLICATION];
    };

    generator.forBlock['math_divide'] = function(block: Blockly.Block) {
        const valueA = generator.valueToCode(block, 'A', generator.ORDER_DIVISION) || '0';
        const valueB = generator.valueToCode(block, 'B', generator.ORDER_DIVISION) || '0';
        return [`${valueA} / ${valueB}`, generator.ORDER_DIVISION];
    };

    generator.forBlock['return_statement'] = function(block: Blockly.Block) {
        const value = generator.valueToCode(block, 'VALUE', generator.ORDER_NONE) || 'null'; // Get value from input
        return `res ${value};\n`;
    };

    generator.forBlock['array_literal'] = function(block: Blockly.Block) {
        const items = generator.statementToCode(block, 'ITEMS');
        const itemsArray = items.trim() ? items.split(',\n').filter((item) => item.trim() !== '') : [];
        return [`[${itemsArray.join(', ')}]`, generator.ORDER_ATOMIC];
    };

    generator.forBlock['array_item'] = function(block: Blockly.Block) {
        const value = generator.valueToCode(block, 'VALUE', generator.ORDER_COMMA) || '""';
        return value + ',\n';
    };

    generator.forBlock['object_literal'] = function(block: Blockly.Block) {
        const properties = generator.statementToCode(block, 'PROPERTIES');
        return [`{ ${properties} }`, generator.ORDER_ATOMIC];
    };

    generator.forBlock['object_property'] = function(block: Blockly.Block) {
        const propName = block.getFieldValue('PROP_NAME');
        const value = generator.valueToCode(block, 'VALUE', generator.ORDER_COMMA) || '""';
        return `${propName}: ${value},`;
    };

    generator.forBlock['variable_reference'] = function(block: Blockly.Block) {
        const varName = block.getFieldValue('VAR_NAME');
        return [varName, generator.ORDER_ATOMIC];
    };

    // Object property access using dot notation
    generator.forBlock['object_property_access'] = function(block: Blockly.Block) {
        const object = generator.valueToCode(block, 'OBJECT', generator.ORDER_MEMBER) || 'null';
        const property = block.getFieldValue('PROPERTY');
        return [`${object}.${property}`, generator.ORDER_MEMBER];
    };

    generator.forBlock['if_statement'] = function(block: Blockly.Block) {
        const condition = generator.valueToCode(block, 'CONDITION', generator.ORDER_NONE) || 'true';
        const statements = generator.statementToCode(block, 'DO') || '';
        
        return `if ${condition} {\n${statements}}\n`;
    };

    generator.forBlock['logic_and'] = function(block: Blockly.Block) {
        const valueA = generator.valueToCode(block, 'A', generator.ORDER_LOGICAL_AND) || 'true';
        const valueB = generator.valueToCode(block, 'B', generator.ORDER_LOGICAL_AND) || 'true';
        return [`${valueA} && ${valueB}`, generator.ORDER_LOGICAL_AND];
    };

    generator.forBlock['logic_or'] = function(block: Blockly.Block) {
        const valueA = generator.valueToCode(block, 'A', generator.ORDER_LOGICAL_OR) || 'false';
        const valueB = generator.valueToCode(block, 'B', generator.ORDER_LOGICAL_OR) || 'false';
        return [`${valueA} || ${valueB}`, generator.ORDER_LOGICAL_OR];
    };

    generator.forBlock['logic_not'] = function(block: Blockly.Block) {
        const value = generator.valueToCode(block, 'BOOL', generator.ORDER_LOGICAL_NOT) || 'true';
        return [`!(${value})`, generator.ORDER_LOGICAL_NOT];
    };

    generator.forBlock['comparison_gt'] = function(block: Blockly.Block) {
        const valueA = generator.valueToCode(block, 'A', generator.ORDER_RELATIONAL) || '0';
        const valueB = generator.valueToCode(block, 'B', generator.ORDER_RELATIONAL) || '0';
        return [`${valueA} > ${valueB}`, generator.ORDER_RELATIONAL];
    };
    
    // Add new comparison operators
    generator.forBlock['comparison_lt'] = function(block: Blockly.Block) {
        const valueA = generator.valueToCode(block, 'A', generator.ORDER_RELATIONAL) || '0';
        const valueB = generator.valueToCode(block, 'B', generator.ORDER_RELATIONAL) || '0';
        return [`${valueA} < ${valueB}`, generator.ORDER_RELATIONAL];
    };
    
    generator.forBlock['comparison_eq'] = function(block: Blockly.Block) {
        const valueA = generator.valueToCode(block, 'A', generator.ORDER_EQUALITY) || '0';
        const valueB = generator.valueToCode(block, 'B', generator.ORDER_EQUALITY) || '0';
        return [`${valueA} == ${valueB}`, generator.ORDER_EQUALITY];
    };
    
    generator.forBlock['comparison_neq'] = function(block: Blockly.Block) {
        const valueA = generator.valueToCode(block, 'A', generator.ORDER_EQUALITY) || '0';
        const valueB = generator.valueToCode(block, 'B', generator.ORDER_EQUALITY) || '0';
        return [`${valueA} != ${valueB}`, generator.ORDER_EQUALITY];
    };
    
    generator.forBlock['comparison_gte'] = function(block: Blockly.Block) {
        const valueA = generator.valueToCode(block, 'A', generator.ORDER_RELATIONAL) || '0';
        const valueB = generator.valueToCode(block, 'B', generator.ORDER_RELATIONAL) || '0';
        return [`${valueA} >= ${valueB}`, generator.ORDER_RELATIONAL];
    };
    
    generator.forBlock['comparison_lte'] = function(block: Blockly.Block) {
        const valueA = generator.valueToCode(block, 'A', generator.ORDER_RELATIONAL) || '0';
        const valueB = generator.valueToCode(block, 'B', generator.ORDER_RELATIONAL) || '0';
        return [`${valueA} <= ${valueB}`, generator.ORDER_RELATIONAL];
    };

    generator.forBlock['loop_statement'] = function(block: Blockly.Block) {
        const iterVar = block.getFieldValue('ITER_VAR');
        const iterable = generator.valueToCode(block, 'ITERABLE', generator.ORDER_MEMBER) || '[]';
        const statements = generator.statementToCode(block, 'DO') || '';
        
        return `loop ${iterVar} in ${iterable} {\n${statements}}\n`;
    };

    // Object property access using dot notation
    generator.forBlock['object_property_access'] = function(block: Blockly.Block) {
        const object = generator.valueToCode(block, 'OBJECT', generator.ORDER_MEMBER) || 'null';
        const property = block.getFieldValue('PROPERTY');
        return [`${object}.${property}`, generator.ORDER_MEMBER];
    };
    
    // Object property access using bracket notation
    generator.forBlock['object_bracket_access'] = function(block: Blockly.Block) {
        const object = generator.valueToCode(block, 'OBJECT', generator.ORDER_MEMBER) || 'null';
        const property = generator.valueToCode(block, 'PROPERTY', generator.ORDER_NONE) || '"property"';
        return [`${object}[${property}]`, generator.ORDER_MEMBER];
    };
    
    // Array index access
    generator.forBlock['array_index_access'] = function(block: Blockly.Block) {
        const array = generator.valueToCode(block, 'ARRAY', generator.ORDER_MEMBER) || '[]';
        const index = generator.valueToCode(block, 'INDEX', generator.ORDER_NONE) || '0';
        return [`${array}[${index}]`, generator.ORDER_MEMBER];
    };

    // Function call implementation
    generator.forBlock['function_call'] = function(block: Blockly.Block) {
        const funcNameCode = generator.valueToCode(block, 'FUNCTION_NAME', generator.ORDER_ATOMIC) || 'undefined';
        const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
        
        // Process the function name - if it's a string literal, remove the quotes
        let functionName = funcNameCode.trim();
        if (functionName.startsWith('"') && functionName.endsWith('"')) {
            functionName = functionName.substring(1, functionName.length - 1).trim();
        }

        if (functionName.startsWith('(') && functionName.endsWith(')')) {
            functionName = functionName.substring(1, functionName.length - 1).trim();
        }
        
        // If there are no parameters, just return the function call
        if (!nextBlock) {
            return [`${functionName}()`, generator.ORDER_FUNCTION_CALL];
        }
        
        // Get the parameters by calling blockToCode but don't add to current code
        const paramsCode = generator.blockToCode(nextBlock, true);
        
        // Mark the params block as processed so it won't be processed again
        if (nextBlock) {
            (nextBlock as any).cancelRender = true;
        }
        
        return [`${functionName}(${paramsCode})`, generator.ORDER_FUNCTION_CALL];
    };
    
    // Function parameters implementation
    generator.forBlock['function_params'] = function(block: Blockly.Block) {
        if ((block as any).cancelRender) {
            (block as any).cancelRender = false;
            return '';
        }

        const paramsCode = generator.statementToCode(block, 'PARAMS');
        const paramsList = paramsCode.trim() ? paramsCode.split(',').map(param => param.trim()).filter(param => param !== '') : [];
        
        return paramsList.join(', ');
    };
    
    // Function parameter implementation
    generator.forBlock['function_parameter'] = function(block: Blockly.Block) {
        const value = generator.valueToCode(block, 'PARAM_VALUE', generator.ORDER_COMMA) || '""';
        return value + ',';
    };

    return generator;
}
