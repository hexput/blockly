import { initBlockly, generateHexputBlockly, addCustomLiteral } from './index';

// Export the API to the window object when used in browser
const hexputBlockly = {
  initBlockly,
  generateHexputBlockly,
  addCustomLiteral
};

export { initBlockly, generateHexputBlockly, addCustomLiteral };
export default hexputBlockly;
