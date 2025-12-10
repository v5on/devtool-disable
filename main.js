/**
 * devtool-disable - Advanced Browser Security Library
 * Version: 2.0.0 (Stable)
 * Author: v5on
 * Repository: https://github.com/v5on/devtool-disable
 * License: MIT
 */

(function (global) {
    'use strict';

    const CONFIG = {
        threshold: 160,       // Time in ms to detect breakpoint pause
        checkInterval: 500,   // How often to check (ms)
        redirect: null,       // URL to redirect (optional)
        onDetect: null        // Custom callback
    };

    const Security = {
        isActive: false,

        init: function (options = {}) {
            if (this.isActive) return;
            this.isActive = true;
            
            // Merge Config
            Object.assign(CONFIG, options);

            // Active Layers
            this.disableMenu();
            this.disableKeyShortcuts();
            this.disableSelection();
            this.startWatcher();

            console.log("%c Secured by devtool-disable ", "background: #222; color: #00ff00; font-weight: bold; padding: 4px; border-radius: 3px;");
        },

        // Layer 1: Context Menu Ban
        disableMenu: function () {
            document.addEventListener('contextmenu', event => event.preventDefault());
        },

        // Layer 2: Shortcut Ban (F12, Ctrl+Shift+I/J/C/U/S)
        disableKeyShortcuts: function () {
            window.addEventListener('keydown', (e) => {
                if (
                    e.key === 'F12' ||
                    (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'K'].includes(e.key.toUpperCase())) ||
                    (e.ctrlKey && ['U', 'S'].includes(e.key.toUpperCase()))
                ) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            }, true);
        },

        // Layer 3: CSS Selection Ban
        disableSelection: function () {
            const css = 'body { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }';
            const head = document.head || document.getElementsByTagName('head')[0];
            const style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
        },

        // Layer 4: Action Trigger (The Punishment)
        trigger: function () {
            // 1. Execute Custom Callback
            if (typeof CONFIG.onDetect === 'function') {
                CONFIG.onDetect();
            }

            // 2. Redirect if set
            if (CONFIG.redirect) {
                window.location.href = CONFIG.redirect;
                return;
            }

            // 3. Default: Destruction (Clear DOM and freeze)
            document.documentElement.innerHTML = `
                <div style="height:100vh;background:#000;color:#ff3333;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:monospace;text-align:center;">
                    <h1 style="font-size:5rem;margin:0;">⚠ BLOCKED</h1>
                    <p style="font-size:1.5rem;color:#fff;">DevTools usage is strictly prohibited.</p>
                </div>
            `;
            
            // 4. Freeze execution
            window.stop();
            throw new Error("Access Denied: DevTools Detected.");
        },

        // Layer 5: Advanced Timing Attack & Debugger Trap
        startWatcher: function () {
            setInterval(() => {
                const start = performance.now();
                
                // The Trap: Code execution pauses here if DevTools is open
                (function(){debugger;})(); 
                
                const end = performance.now();

                // If execution took longer than threshold, the browser was paused by DevTools
                if (end - start > CONFIG.threshold) {
                    this.trigger();
                }
            }, CONFIG.checkInterval);
        }
    };

    // Prevent Tampering
    Object.freeze(Security);

    // Expose to Global Scope
    global.DevToolDisable = Security;

    // --- AUTO LAUNCHER ---
    // Detects <script disable-devtool-auto src="...">
    try {
        const currentScript = document.currentScript || (function() {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();

        if (currentScript && currentScript.hasAttribute('disable-devtool-auto')) {
            Security.init();
        }
    } catch (e) {
        console.warn("DevToolDisable: Auto-init failed. Please init manually.");
    }

})(window);
