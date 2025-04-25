// Import the actual implementations instead of using Node.js modules directly
import { Buffer } from 'buffer';
import process from 'process';

// Make these available in the global scope
window.Buffer = Buffer;
window.process = process;
window.global = window;