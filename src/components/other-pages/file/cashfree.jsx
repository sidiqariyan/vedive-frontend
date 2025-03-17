// frontend/file/cashfree.js
import { load } from '@cashfreepayments/cashfree-js';

const cashfree = await load({
  mode: "sandbox" // Change to "production" when ready
});

export default cashfree;
