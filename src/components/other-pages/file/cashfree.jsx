// file: src/utils/cashfree.jsx
import { load as loadCashfree } from "./cashfree-loader";

let initialized = false;

/**
 * Initialize Cashfree SDK once (with optional params).
 * @param {{ mode?: "PROD" | "TEST" }} [options]
 * @returns {Promise<any>}
 */
export function initializeCashfree(options = { mode: "PROD" }) {
  if (!initialized) {
    initialized = true;
    return loadCashfree(options);
  }
  return loadCashfree();
}

/**
 * Get the initialized Cashfree instance.
 * @returns {Promise<any>}
 */
export async function getCashfree() {
  const cf = await initializeCashfree();
  if (!cf) {
    throw new Error("Cashfree SDK not initialized");
  }
  return cf;
}

/**
 * Open Cashfree checkout.
 * @param {Object} options - Checkout options with paymentSessionId and returnUrl
 * @returns {Promise<any>}
 */
export async function checkout(options) {
  try {
    const cf = await getCashfree();
    // Use cf.checkout directly as per documentation
    return await cf.checkout({
      paymentSessionId: options.paymentSessionId,
      returnUrl: options.returnUrl || `${window.location.origin}/plans/payment-status?order_id=${options.orderId}`,
    });
  } catch (err) {
    console.error("Cashfree checkout error:", err);
    return {
      error: {
        message: err.message || "Payment gateway initialization failed",
      },
    };
  }
}

/**
 * Function to call from Plan.jsx
 * @param {string} sessionId - Payment session ID from backend
 * @param {string} orderId - Order ID from backend
 * @returns {Promise<any>}
 */
export async function initializePayment(sessionId, orderId) {
  try {
    const result = await checkout({
      paymentSessionId: sessionId,
      orderId: orderId,
      returnUrl: `${window.location.origin}/plans/payment-status?order_id=${orderId}`,
    });
    return result;
  } catch (error) {
    console.error("Payment initialization failed:", error);
    return {
      error: {
        message: error.message || "Payment initialization failed",
      },
    };
  }
}