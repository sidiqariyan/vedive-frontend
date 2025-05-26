// file: src/utils/cashfree-loader.js
"use strict";

const V3_URL = "https://sdk.cashfree.com/js/cashfree.js";
const V3_URL_REGEX = /^https:\/\/sdk\.cashfree\.com\/js\/cashfree\.js(\?.*)?$/;
const EXISTING_SCRIPT_MESSAGE =
  "load was called but an existing Cashfree.js script already exists; existing script parameters will be used";

/**
 * Finds an existing Cashfree script tag in the document
 * @returns {HTMLScriptElement|null}
 */
function findScript() {
  const selector = `script[src^="${V3_URL}"]`;
  const scripts = document.querySelectorAll(selector);
  for (const script of scripts) {
    if (V3_URL_REGEX.test(script.src)) {
      return script;
    }
  }
  return null;
}

/**
 * Injects the Cashfree script into the page
 * @param {Object} params - Query parameters to append to script URL
 * @returns {HTMLScriptElement} - The created script element
 */
function injectScript(params) {
  const query =
    params && Object.keys(params).length
      ? "?" +
        Object.entries(params)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join("&")
      : "";
  
  const script = document.createElement("script");
  script.src = V3_URL + query;
  script.async = true;
  script.type = "text/javascript";
  
  const container = document.head || document.body;
  if (!container) {
    throw new Error(
      "Expected document.head or document.body to exist; Cashfree.js needs a <body>."
    );
  }
  
  container.appendChild(script);
  return script;
}

let cashfreePromise = null;

/**
 * Loads the Cashfree.js SDK only once.
 * @param {{ mode?: string }} [params] Optional query-string parameters (e.g. { mode: "PROD" }).
 * @returns {Promise<any>}
 */
export function load(params = {}) {
  if (cashfreePromise) {
    // If already on window.Cashfree and params present, warn
    if (window.Cashfree && Object.keys(params).length) {
      console.warn(EXISTING_SCRIPT_MESSAGE);
    }
    return cashfreePromise;
  }

  cashfreePromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !document.body) {
      // Safe SSR fallback
      resolve(null);
      return;
    }

    if (window.Cashfree) {
      // Already loaded in another way
      resolve(window.Cashfree);
      return;
    }

    try {
      let script = findScript();
      if (script) {
        if (Object.keys(params).length) {
          console.warn(EXISTING_SCRIPT_MESSAGE);
        }
      } else {
        script = injectScript(params);
      }

      script.addEventListener("load", () => {
        if (window.Cashfree) resolve(window.Cashfree);
        else reject(new Error("Cashfree.js loaded but window.Cashfree is undefined"));
      });
      
      script.addEventListener("error", () =>
        reject(new Error("Failed to load Cashfree.js"))
      );
    } catch (err) {
      reject(err);
    }
  });

  return cashfreePromise;
}

// file: src/utils/cashfree.js


