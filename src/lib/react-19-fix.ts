"use client";

import * as ReactDOM from 'react-dom';

/**
 * React 19 Polyfill for findDOMNode
 * Many legacy libraries still rely on findDOMNode which was removed in React 19.
 * This shim prevents crashes while we transition to React 19 compatible versions.
 */
if (typeof window !== 'undefined') {
    const findDOMNodePolyfill = (instance: any) => {
        if (!instance) return null;
        if (instance instanceof HTMLElement) return instance;
        return instance.getDOMNode ? instance.getDOMNode() : null;
    };

    // Helper to apply polyfill to various export patterns
    const applyPolyfill = (obj: any) => {
        if (!obj || typeof obj !== 'object' || Object.isFrozen(obj)) return;

        // Define if missing
        if (!obj.findDOMNode) {
            try {
                if (Object.isExtensible(obj)) {
                    Object.defineProperty(obj, 'findDOMNode', {
                        value: findDOMNodePolyfill,
                        configurable: true,
                        writable: true
                    });
                }
            } catch (e) {
                // Ignore errors - we can't patch this specific object
                console.warn('Myark: Could not polyfill findDOMNode on a non-extensible object.');
            }
        }
    };

    // Apply to the main ReactDOM object
    applyPolyfill(ReactDOM);

    // Apply to the default export if it exists
    if ((ReactDOM as any).default) {
        applyPolyfill((ReactDOM as any).default);
    }

    // Try to catch window-level references which are usually extensible
    if (!(window as any).ReactDOM) {
        (window as any).ReactDOM = {};
    }
    applyPolyfill((window as any).ReactDOM);

    // Some libraries use window.ReactDOM.default
    if ((window as any).ReactDOM && !(window as any).ReactDOM.default) {
        try {
            (window as any).ReactDOM.default = (window as any).ReactDOM;
        } catch (e) { }
    }
}

export { };
