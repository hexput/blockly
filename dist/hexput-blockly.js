"use strict";
var hexputBlockly = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/browser-entry.js
  var browser_entry_exports = {};
  __export(browser_entry_exports, {
    addCustomLiteral: () => addCustomLiteral,
    default: () => browser_entry_default,
    generateHexputBlockly: () => generateHexputBlockly,
    initBlockly: () => initBlockly
  });

  // src/index.ts
  function initBlockly(blockly, container, toolboxDefinition) {
    container = typeof container == "string" ? document.getElementById(container) : container;
    if (!container) {
      console.error(`Container element with ID '${container}' not found.`);
      return;
    }
    let toolbox;
    if (toolboxDefinition) {
      toolbox = toolboxDefinition;
    } else {
      const toolboxElement = document.getElementById("toolbox");
      if (toolboxElement) {
        toolbox = toolboxElement;
      } else {
        console.warn("No toolbox element found with ID 'toolbox'. Using empty toolbox.");
        toolbox = "<xml></xml>";
      }
    }
    defineBlockTypes(blockly);
    const hexputGenerator = generateHexputBlockly(blockly);
    blockly.Hexput = hexputGenerator;
    registerCustomBlocks(hexputGenerator);
    const workspace = blockly.inject(container, {
      toolbox,
      // You can add other default options here
      trashcan: true,
      scrollbars: true
    });
    return workspace;
  }
  function generateHexputBlockly(blockly) {
    const hexputGenerator = blockly.Hexput || new blockly.Generator("Hexput");
    hexputGenerator.init = function(workspace) {
    };
    hexputGenerator.finish = function(code) {
      const lines = code.split("\n");
      const processedLines = lines.map((line) => {
        if (!line.trim())
          return line;
        if (/[;{}]\s*$/.test(line) || line.trim().endsWith("}"))
          return line;
        return line + ";";
      });
      return processedLines.join("\n");
    };
    hexputGenerator.scrub_ = function(block, code, opt_thisOnly) {
      const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
      const nextCode = opt_thisOnly ? "" : hexputGenerator.blockToCode(nextBlock);
      return code + nextCode;
    };
    hexputGenerator.ORDER_ATOMIC = 0;
    hexputGenerator.ORDER_ADDITION = 13;
    hexputGenerator.ORDER_SUBTRACTION = 13;
    hexputGenerator.ORDER_MULTIPLICATION = 14;
    hexputGenerator.ORDER_DIVISION = 14;
    hexputGenerator.ORDER_ASSIGNMENT = 3;
    hexputGenerator.ORDER_COMMA = 0;
    hexputGenerator.ORDER_MEMBER = 2;
    hexputGenerator.ORDER_FUNCTION_CALL = 2;
    hexputGenerator.ORDER_LOGICAL_AND = 6;
    hexputGenerator.ORDER_LOGICAL_OR = 5;
    hexputGenerator.ORDER_NONE = 99;
    hexputGenerator.ORDER_LOGICAL_NOT = 7;
    hexputGenerator.ORDER_RELATIONAL = 11;
    hexputGenerator.ORDER_EQUALITY = 10;
    return hexputGenerator;
  }
  function defineBlockTypes(blockly) {
    blockly.Blocks["variable_declaration"] = {
      init: function() {
        this.jsonInit({
          type: "variable_declaration",
          message0: "vl %1 = %2",
          args0: [
            {
              type: "field_input",
              name: "VAR_NAME",
              text: "varName"
            },
            {
              type: "input_value",
              name: "VALUE",
              check: null
              // Accept any type of input
            }
          ],
          previousStatement: null,
          nextStatement: null,
          colour: 230,
          tooltip: "Declare a variable with the vl keyword",
          helpUrl: ""
        });
      }
    };
    blockly.Blocks["number_literal"] = {
      init: function() {
        this.jsonInit({
          type: "number_literal",
          message0: "%1",
          args0: [
            {
              type: "field_number",
              name: "NUM",
              value: 0
            }
          ],
          output: "Number",
          colour: 160,
          tooltip: "A number value",
          helpUrl: ""
        });
      }
    };
    blockly.Blocks["string_literal"] = {
      init: function() {
        this.jsonInit({
          type: "string_literal",
          message0: '"%1"',
          args0: [
            {
              type: "field_input",
              name: "TEXT",
              text: ""
            }
          ],
          output: "String",
          colour: 160,
          tooltip: "A string value",
          helpUrl: ""
        });
      }
    };
    blockly.Blocks["boolean_literal"] = {
      init: function() {
        this.jsonInit({
          type: "boolean_literal",
          message0: "%1",
          args0: [
            {
              type: "field_dropdown",
              name: "BOOL",
              options: [
                ["true", "true"],
                ["false", "false"]
              ]
            }
          ],
          output: "Boolean",
          colour: 160,
          tooltip: "A boolean value (true or false)",
          helpUrl: ""
        });
      }
    };
    blockly.Blocks["any_concat"] = {
      init: function() {
        this.jsonInit({
          type: "any_concat",
          message0: "%1 + %2",
          args0: [
            {
              type: "field_input",
              name: "A",
              check: null
              // Accept any type
            },
            {
              type: "field_input",
              name: "B",
              check: null
              // Accept any type
            }
          ],
          output: null,
          colour: 160,
          tooltip: "Concatenate any two values",
          helpUrl: ""
        });
      }
    };
    blockly.Blocks["math_subtract"] = {
      init: function() {
        this.jsonInit({
          type: "math_subtract",
          message0: "%1 - %2",
          args0: [
            {
              type: "field_input",
              name: "A",
              check: null
              // Accept any type
            },
            {
              type: "field_input",
              name: "B",
              check: null
              // Accept any type
            }
          ],
          output: null,
          colour: 160,
          tooltip: "Subtract two values",
          helpUrl: ""
        });
      }
    };
    blockly.Blocks["math_multiply"] = {
      init: function() {
        this.jsonInit({
          type: "math_multiply",
          message0: "%1 \xD7 %2",
          args0: [
            {
              type: "field_input",
              name: "A",
              check: null
              // Accept any type
            },
            {
              type: "field_input",
              name: "B",
              check: null
              // Accept any type
            }
          ],
          output: null,
          colour: 160,
          tooltip: "Multiply two values",
          helpUrl: ""
        });
      }
    };
    blockly.Blocks["math_divide"] = {
      init: function() {
        this.jsonInit({
          type: "math_divide",
          message0: "%1 \xF7 %2",
          args0: [
            {
              type: "field_input",
              name: "A",
              check: null
              // Accept any type
            },
            {
              type: "field_input",
              name: "B",
              check: null
              // Accept any type
            }
          ],
          output: null,
          colour: 160,
          tooltip: "Divide two values",
          helpUrl: ""
        });
      }
    };
    blockly.Blocks["array_literal"] = {
      init: function() {
        this.jsonInit({
          type: "array_literal",
          message0: "List %1",
          args0: [
            {
              type: "input_statement",
              name: "ITEMS",
              check: "ArrayItem"
            }
          ],
          output: "Array",
          colour: 290,
          tooltip: "Create an array",
          helpUrl: ""
        });
      }
    };
    blockly.Blocks["array_item"] = {
      init: function() {
        this.jsonInit({
          type: "array_item",
          message0: "%1",
          args0: [
            {
              type: "input_value",
              name: "VALUE",
              check: null
            }
          ],
          previousStatement: "ArrayItem",
          nextStatement: "ArrayItem",
          colour: 290,
          tooltip: "Item in an array",
          helpUrl: ""
        });
      }
    };
    blockly.Blocks["object_literal"] = {
      init: function() {
        this.jsonInit({
          type: "object_literal",
          message0: "Object %1",
          args0: [
            {
              type: "input_statement",
              name: "PROPERTIES",
              check: "ObjectProperty"
            }
          ],
          output: "Object",
          colour: 210,
          tooltip: "Create an object",
          helpUrl: ""
        });
      }
    };
    blockly.Blocks["object_property"] = {
      init: function() {
        this.jsonInit({
          type: "object_property",
          message0: "%1 : %2",
          args0: [
            {
              type: "field_input",
              name: "PROP_NAME",
              text: "property"
            },
            {
              type: "input_value",
              name: "VALUE",
              check: null
            }
          ],
          previousStatement: "ObjectProperty",
          nextStatement: "ObjectProperty",
          colour: 210,
          tooltip: "Property in an object",
          helpUrl: ""
        });
      }
    };
    blockly.Blocks["variable_reference"] = {
      init: function() {
        this.jsonInit({
          type: "variable_reference",
          message0: "%1",
          args0: [
            {
              type: "field_input",
              name: "VAR_NAME",
              text: "varName"
            }
          ],
          output: null,
          colour: 230,
          tooltip: "Reference a variable by name",
          helpUrl: ""
        });
      }
    };
    blockly.Blocks["if_statement"] = {
      init: function() {
        this.jsonInit({
          type: "if_statement",
          message0: "if %1",
          args0: [
            {
              type: "input_value",
              name: "CONDITION",
              check: null
            }
          ],
          message1: "%1",
          args1: [
            {
              type: "input_statement",
              name: "DO"
            }
          ],
          previousStatement: null,
          nextStatement: null,
          colour: 210,
          tooltip: "If statement - executes the block if the condition is true",
          helpUrl: ""
        });
      }
    };
    blockly.Blocks["logic_and"] = {
      init: function() {
        this.appendValueInput("A").setCheck(null);
        this.appendValueInput("B").setCheck(null).appendField("and");
        this.setInputsInline(true);
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("Logical AND operator");
        this.setHelpUrl("");
      }
    };
    blockly.Blocks["logic_or"] = {
      init: function() {
        this.appendValueInput("A").setCheck(null);
        this.appendValueInput("B").setCheck(null).appendField("or");
        this.setInputsInline(true);
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("Logical OR operator");
        this.setHelpUrl("");
      }
    };
    blockly.Blocks["logic_not"] = {
      init: function() {
        this.appendValueInput("BOOL").setCheck(null).appendField("not");
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("Logical NOT operator");
        this.setHelpUrl("");
      }
    };
    blockly.Blocks["comparison_gt"] = {
      init: function() {
        this.appendValueInput("A").setCheck(null);
        this.appendValueInput("B").setCheck(null).appendField("greater than");
        this.setInputsInline(true);
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("Greater than comparison");
        this.setHelpUrl("");
      }
    };
    blockly.Blocks["comparison_lt"] = {
      init: function() {
        this.appendValueInput("A").setCheck(null);
        this.appendValueInput("B").setCheck(null).appendField("less than");
        this.setInputsInline(true);
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("Less than comparison");
        this.setHelpUrl("");
      }
    };
    blockly.Blocks["comparison_eq"] = {
      init: function() {
        this.appendValueInput("A").setCheck(null);
        this.appendValueInput("B").setCheck(null).appendField("equals");
        this.setInputsInline(true);
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("Equality comparison");
        this.setHelpUrl("");
      }
    };
    blockly.Blocks["comparison_neq"] = {
      init: function() {
        this.appendValueInput("A").setCheck(null);
        this.appendValueInput("B").setCheck(null).appendField("not equal to");
        this.setInputsInline(true);
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("Inequality comparison");
        this.setHelpUrl("");
      }
    };
    blockly.Blocks["comparison_gte"] = {
      init: function() {
        this.appendValueInput("A").setCheck(null);
        this.appendValueInput("B").setCheck(null).appendField("greater than or equal to");
        this.setInputsInline(true);
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("Greater than or equal comparison");
        this.setHelpUrl("");
      }
    };
    blockly.Blocks["comparison_lte"] = {
      init: function() {
        this.appendValueInput("A").setCheck(null);
        this.appendValueInput("B").setCheck(null).appendField("less than or equal to");
        this.setInputsInline(true);
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("Less than or equal comparison");
        this.setHelpUrl("");
      }
    };
    blockly.Blocks["loop_statement"] = {
      init: function() {
        this.jsonInit({
          type: "loop_statement",
          message0: "loop %1 in %2",
          args0: [
            {
              type: "field_input",
              name: "ITER_VAR",
              text: "item"
            },
            {
              type: "input_value",
              name: "ITERABLE",
              check: null
            }
          ],
          message1: "%1",
          args1: [
            {
              type: "input_statement",
              name: "DO"
            }
          ],
          previousStatement: null,
          nextStatement: null,
          colour: 120,
          tooltip: "Loop through items in a collection",
          helpUrl: ""
        });
      }
    };
    blockly.Blocks["object_property_access"] = {
      init: function() {
        this.appendValueInput("OBJECT").setCheck(null);
        this.appendDummyInput().appendField(".").appendField(new blockly.FieldTextInput("property"), "PROPERTY");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(210);
        this.setTooltip("Access an object property using dot notation");
        this.setHelpUrl("");
      }
    };
    blockly.Blocks["object_bracket_access"] = {
      init: function() {
        this.appendValueInput("OBJECT").setCheck(null);
        this.appendValueInput("PROPERTY").setCheck(null).appendField("[");
        this.appendDummyInput().appendField("]");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(210);
        this.setTooltip("Access an object property using bracket notation");
        this.setHelpUrl("");
      }
    };
    blockly.Blocks["array_index_access"] = {
      init: function() {
        this.appendValueInput("ARRAY").setCheck(null);
        this.appendValueInput("INDEX").setCheck("Number").appendField("[");
        this.appendDummyInput().appendField("]");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(290);
        this.setTooltip("Access an array element by index");
        this.setHelpUrl("");
      }
    };
    blockly.Blocks["function_call"] = {
      init: function() {
        this.appendValueInput("FUNCTION_NAME").setCheck(null).appendField("call");
        this.setOutput(true, null);
        this.setNextStatement(true, "FunctionParams");
        this.setColour(160);
        this.setTooltip("Call a function");
        this.setHelpUrl("");
      }
    };
    blockly.Blocks["function_params"] = {
      init: function() {
        this.appendDummyInput().appendField("with parameters");
        this.appendStatementInput("PARAMS").setCheck("FunctionParameter");
        this.setPreviousStatement(true, "FunctionParams");
        this.setColour(160);
        this.setTooltip("Add parameters to a function call");
        this.setHelpUrl("");
      }
    };
    blockly.Blocks["function_parameter"] = {
      init: function() {
        this.appendValueInput("PARAM_VALUE").setCheck(null);
        this.setPreviousStatement(true, "FunctionParameter");
        this.setNextStatement(true, "FunctionParameter");
        this.setColour(160);
        this.setTooltip("Parameter for a function call");
        this.setHelpUrl("");
      }
    };
  }
  function addCustomLiteral(blockly, hexputGenerator, type, literalLabel, literalValue) {
    blockly.Blocks[type] = {
      init: function() {
        this.appendDummyInput().appendField(literalLabel);
        this.setOutput(true, null);
        this.setColour(330);
        this.setTooltip(`Custom literal: ${literalLabel}`);
        this.setHelpUrl("");
      }
    };
    if (!hexputGenerator.forBlock) {
      hexputGenerator.forBlock = {};
    }
    hexputGenerator.forBlock[type] = function(block) {
      return [literalValue, hexputGenerator.ORDER_ATOMIC];
    };
    return type;
  }
  function registerCustomBlocks(generator) {
    if (!generator.forBlock) {
      generator.forBlock = {};
    }
    generator.forBlock["variable_declaration"] = function(block) {
      const varName = block.getFieldValue("VAR_NAME");
      const value = generator.valueToCode(block, "VALUE", generator.ORDER_ASSIGNMENT) || '""';
      return `vl ${varName} = ${value};
`;
    };
    generator.forBlock["number_literal"] = function(block) {
      const number = block.getFieldValue("NUM");
      return [number, generator.ORDER_ATOMIC];
    };
    generator.forBlock["string_literal"] = function(block) {
      const text = block.getFieldValue("TEXT");
      return [`"${text}"`, generator.ORDER_ATOMIC];
    };
    generator.forBlock["boolean_literal"] = function(block) {
      const value = block.getFieldValue("BOOL");
      return [value, generator.ORDER_ATOMIC];
    };
    generator.forBlock["any_concat"] = function(block) {
      const valueA = generator.valueToCode(block, "A", generator.ORDER_ADDITION) || '""';
      const valueB = generator.valueToCode(block, "B", generator.ORDER_ADDITION) || '""';
      return [`${valueA} + ${valueB}`, generator.ORDER_ADDITION];
    };
    generator.forBlock["math_subtract"] = function(block) {
      const valueA = generator.valueToCode(block, "A", generator.ORDER_SUBTRACTION) || "0";
      const valueB = generator.valueToCode(block, "B", generator.ORDER_SUBTRACTION) || "0";
      return [`${valueA} - ${valueB}`, generator.ORDER_SUBTRACTION];
    };
    generator.forBlock["math_multiply"] = function(block) {
      const valueA = generator.valueToCode(block, "A", generator.ORDER_MULTIPLICATION) || "0";
      const valueB = generator.valueToCode(block, "B", generator.ORDER_MULTIPLICATION) || "0";
      return [`${valueA} * ${valueB}`, generator.ORDER_MULTIPLICATION];
    };
    generator.forBlock["math_divide"] = function(block) {
      const valueA = generator.valueToCode(block, "A", generator.ORDER_DIVISION) || "0";
      const valueB = generator.valueToCode(block, "B", generator.ORDER_DIVISION) || "0";
      return [`${valueA} / ${valueB}`, generator.ORDER_DIVISION];
    };
    generator.forBlock["array_literal"] = function(block) {
      const items = generator.statementToCode(block, "ITEMS");
      const itemsArray = items.trim() ? items.split(",\n").filter((item) => item.trim() !== "") : [];
      return [`[${itemsArray.join(", ")}]`, generator.ORDER_ATOMIC];
    };
    generator.forBlock["array_item"] = function(block) {
      const value = generator.valueToCode(block, "VALUE", generator.ORDER_COMMA) || '""';
      return value + ",\n";
    };
    generator.forBlock["object_literal"] = function(block) {
      const properties = generator.statementToCode(block, "PROPERTIES");
      return [`{ ${properties} }`, generator.ORDER_ATOMIC];
    };
    generator.forBlock["object_property"] = function(block) {
      const propName = block.getFieldValue("PROP_NAME");
      const value = generator.valueToCode(block, "VALUE", generator.ORDER_COMMA) || '""';
      return `${propName}: ${value},`;
    };
    generator.forBlock["variable_reference"] = function(block) {
      const varName = block.getFieldValue("VAR_NAME");
      return [varName, generator.ORDER_ATOMIC];
    };
    generator.forBlock["object_property_access"] = function(block) {
      const object = generator.valueToCode(block, "OBJECT", generator.ORDER_MEMBER) || "null";
      const property = block.getFieldValue("PROPERTY");
      return [`${object}.${property}`, generator.ORDER_MEMBER];
    };
    generator.forBlock["if_statement"] = function(block) {
      const condition = generator.valueToCode(block, "CONDITION", generator.ORDER_NONE) || "true";
      const statements = generator.statementToCode(block, "DO") || "";
      return `if ${condition} {
${statements}}
`;
    };
    generator.forBlock["logic_and"] = function(block) {
      const valueA = generator.valueToCode(block, "A", generator.ORDER_LOGICAL_AND) || "true";
      const valueB = generator.valueToCode(block, "B", generator.ORDER_LOGICAL_AND) || "true";
      return [`${valueA} && ${valueB}`, generator.ORDER_LOGICAL_AND];
    };
    generator.forBlock["logic_or"] = function(block) {
      const valueA = generator.valueToCode(block, "A", generator.ORDER_LOGICAL_OR) || "false";
      const valueB = generator.valueToCode(block, "B", generator.ORDER_LOGICAL_OR) || "false";
      return [`${valueA} || ${valueB}`, generator.ORDER_LOGICAL_OR];
    };
    generator.forBlock["logic_not"] = function(block) {
      const value = generator.valueToCode(block, "BOOL", generator.ORDER_LOGICAL_NOT) || "true";
      return [`!(${value})`, generator.ORDER_LOGICAL_NOT];
    };
    generator.forBlock["comparison_gt"] = function(block) {
      const valueA = generator.valueToCode(block, "A", generator.ORDER_RELATIONAL) || "0";
      const valueB = generator.valueToCode(block, "B", generator.ORDER_RELATIONAL) || "0";
      return [`${valueA} > ${valueB}`, generator.ORDER_RELATIONAL];
    };
    generator.forBlock["comparison_lt"] = function(block) {
      const valueA = generator.valueToCode(block, "A", generator.ORDER_RELATIONAL) || "0";
      const valueB = generator.valueToCode(block, "B", generator.ORDER_RELATIONAL) || "0";
      return [`${valueA} < ${valueB}`, generator.ORDER_RELATIONAL];
    };
    generator.forBlock["comparison_eq"] = function(block) {
      const valueA = generator.valueToCode(block, "A", generator.ORDER_EQUALITY) || "0";
      const valueB = generator.valueToCode(block, "B", generator.ORDER_EQUALITY) || "0";
      return [`${valueA} == ${valueB}`, generator.ORDER_EQUALITY];
    };
    generator.forBlock["comparison_neq"] = function(block) {
      const valueA = generator.valueToCode(block, "A", generator.ORDER_EQUALITY) || "0";
      const valueB = generator.valueToCode(block, "B", generator.ORDER_EQUALITY) || "0";
      return [`${valueA} != ${valueB}`, generator.ORDER_EQUALITY];
    };
    generator.forBlock["comparison_gte"] = function(block) {
      const valueA = generator.valueToCode(block, "A", generator.ORDER_RELATIONAL) || "0";
      const valueB = generator.valueToCode(block, "B", generator.ORDER_RELATIONAL) || "0";
      return [`${valueA} >= ${valueB}`, generator.ORDER_RELATIONAL];
    };
    generator.forBlock["comparison_lte"] = function(block) {
      const valueA = generator.valueToCode(block, "A", generator.ORDER_RELATIONAL) || "0";
      const valueB = generator.valueToCode(block, "B", generator.ORDER_RELATIONAL) || "0";
      return [`${valueA} <= ${valueB}`, generator.ORDER_RELATIONAL];
    };
    generator.forBlock["loop_statement"] = function(block) {
      const iterVar = block.getFieldValue("ITER_VAR");
      const iterable = generator.valueToCode(block, "ITERABLE", generator.ORDER_MEMBER) || "[]";
      const statements = generator.statementToCode(block, "DO") || "";
      return `loop ${iterVar} in ${iterable} {
${statements}}
`;
    };
    generator.forBlock["object_property_access"] = function(block) {
      const object = generator.valueToCode(block, "OBJECT", generator.ORDER_MEMBER) || "null";
      const property = block.getFieldValue("PROPERTY");
      return [`${object}.${property}`, generator.ORDER_MEMBER];
    };
    generator.forBlock["object_bracket_access"] = function(block) {
      const object = generator.valueToCode(block, "OBJECT", generator.ORDER_MEMBER) || "null";
      const property = generator.valueToCode(block, "PROPERTY", generator.ORDER_NONE) || '"property"';
      return [`${object}[${property}]`, generator.ORDER_MEMBER];
    };
    generator.forBlock["array_index_access"] = function(block) {
      const array = generator.valueToCode(block, "ARRAY", generator.ORDER_MEMBER) || "[]";
      const index = generator.valueToCode(block, "INDEX", generator.ORDER_NONE) || "0";
      return [`${array}[${index}]`, generator.ORDER_MEMBER];
    };
    generator.forBlock["function_call"] = function(block) {
      const funcNameCode = generator.valueToCode(block, "FUNCTION_NAME", generator.ORDER_ATOMIC) || "undefined";
      const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
      let functionName = funcNameCode.trim();
      if (functionName.startsWith('"') && functionName.endsWith('"')) {
        functionName = functionName.substring(1, functionName.length - 1).trim();
      }
      if (functionName.startsWith("(") && functionName.endsWith(")")) {
        functionName = functionName.substring(1, functionName.length - 1).trim();
      }
      if (!nextBlock) {
        return [`${functionName}()`, generator.ORDER_FUNCTION_CALL];
      }
      const paramsCode = generator.blockToCode(nextBlock, true);
      if (nextBlock) {
        nextBlock.cancelRender = true;
      }
      return [`${functionName}(${paramsCode})`, generator.ORDER_FUNCTION_CALL];
    };
    generator.forBlock["function_params"] = function(block) {
      if (block.cancelRender) {
        block.cancelRender = false;
        return "";
      }
      const paramsCode = generator.statementToCode(block, "PARAMS");
      const paramsList = paramsCode.trim() ? paramsCode.split(",").map((param) => param.trim()).filter((param) => param !== "") : [];
      return paramsList.join(", ");
    };
    generator.forBlock["function_parameter"] = function(block) {
      const value = generator.valueToCode(block, "PARAM_VALUE", generator.ORDER_COMMA) || '""';
      return value + ",";
    };
    return generator;
  }

  // src/browser-entry.js
  var hexputBlockly = {
    initBlockly,
    generateHexputBlockly,
    addCustomLiteral
  };
  var browser_entry_default = hexputBlockly;
  return __toCommonJS(browser_entry_exports);
})();
