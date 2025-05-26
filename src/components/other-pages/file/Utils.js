// file: src/utils/utils.js
import { load } from '@cashfreepayments/cashfree-js';

export const cashfree = await load({
  mode: "production" // Changed from sandbox to production
});