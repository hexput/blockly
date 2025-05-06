import * as Blockly from 'blockly';

export interface HexputGenerator extends Blockly.Generator {
  // Order constants for operator precedence
  ORDER_ATOMIC: number;
  ORDER_ADDITION: number;
  ORDER_ASSIGNMENT: number;
  ORDER_COMMA: number;
  
  // Generator methods that must be implemented
  init(workspace: Blockly.Workspace): void;
  finish(code: string): string;
  
  // Block-specific generator functions
  [blockType: string]: any;
}
