import { initBlockly, generateHexputBlockly } from './index';

// Export the API to the window object when used in browser
const hexputBlockly = {
  initBlockly,
  generateHexputBlockly
};

export { initBlockly, generateHexputBlockly };
export default hexputBlockly;
