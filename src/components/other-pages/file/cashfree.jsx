import { load } from '@cashfreepayments/cashfree-js';

let cashfree; // Declare it globally

async function initialize() {
  cashfree = await load({
    mode: "sandbox"
  });
}

initialize();

export { cashfree, initialize }; // Export both
