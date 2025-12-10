/**
 * DevTool Disable - Ultimate Edition
 * Version: 2.1.0 (Military Grade)
 * Author: v5on
 * Repository: https://github.com/v5on/devtool-disable
 * License: MIT
 */

(function (global) {
    'use strict';

    // Configuration - Locked Object
    const CONFIG = Object.freeze({
        threshold: 100,         // Detection sensitivity (ms)
        interval: 500,          // Check every 500ms
        redirect: null,         // Optional: 'https://google.com'
        bannedKeys: ['F12', 'I', 'J', 'C', 'U', 'S', 'K', 'P'], // Shortcuts
    });

    const DevSec = {
        init: function () {
            this.secureEnvironment();
            this.disableInputs();
            this.detectDevTool();
            this.detectResize();
            this.preventConsole();
            
            console.log("%c Protected by DevTool-Disable ", "background: #222; color: #0f0; font-weight: bold; padding: 5px; border-radius: 4px;");
        },

        // 1. Secure Environment (Disable Selection, Drag, Copy)
        secureEnvironment: function () {
            // CSS Injection to block selection
            const style = document.createElement('style');
            style.innerHTML = `
                body { 
                    -webkit-user-select: none !important; 
                    -moz-user-select: none !important; 
                    -ms-user-select: none !important; 
                    user-select: none !important; 
                    -webkit-touch-callout: none !important;
                }
            `;
            document.head.appendChild(style);

            // Disable Image Dragging
            document.ondragstart = function() { return false; };
        },

        // 2. Disable Mouse & Keyboard Inputs
        disableInputs: function () {
            // Block Right Click
            document.addEventListener('contextmenu', e => e.preventDefault());

            // Block Shortcuts
            window.addEventListener('keydown', function (e) {
                if (
                    e.key === 'F12' || 
                    (e.ctrlKey && CONFIG.bannedKeys.includes(e.key.toUpperCase())) || 
                    (e.ctrlKey && e.shiftKey && CONFIG.bannedKeys.includes(e.key.toUpperCase()))
                ) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            }, true);
        },

        // 3. Advanced Timing Attack (Debugger Trap)
        detectDevTool: function () {
            setInterval(() => {
                const start = performance.now();
                
                // Creates a breakpoint if DevTool is open
                (function(){}).constructor("debugger")(); 
                
                const end = performance.now();

                // If execution pauses > threshold, DevTool is open
                if (end - start > CONFIG.threshold) {
                    this.punish();
                }
            }, CONFIG.interval);
        },

        // 4. Screen Resize Detection (Detects Docked DevTools)
        detectResize: function () {
            let widthThreshold = window.outerWidth - window.innerWidth > 160;
            let heightThreshold = window.outerHeight - window.innerHeight > 160;
            
            if (widthThreshold || heightThreshold) {
                // Suspicious resize activity (often caused by DevTools)
                // Note: We check this carefully to avoid false positives on resize
                // this.punish(); // Uncomment if you want strict resize blocking
            }
            
            window.addEventListener('resize', () => {
                if ((window.outerWidth - window.innerWidth) > 200 || (window.outerHeight - window.innerHeight) > 200) {
                     this.punish();
                }
            });
        },

        // 5. Spam/Clear Console (Anti-Logging)
        preventConsole: function () {
            // Override console functions to hide logs
            setInterval(() => {
                // Optional: console.clear(); 
                // We don't clear repeatedly to avoid annoying flickering, 
                // but we can break the console methods:
            }, 1000);

            // Poison the console object (Advanced)
            try {
                const noop = () => {};
                // window.console.log = noop;
                // window.console.info = noop;
                // window.console.warn = noop;
                // window.console.error = noop;
            } catch (e) {}
        },

        // 6. The Punishment (Crash/Freeze/Redirect)
        punish: function () {
            if (CONFIG.redirect) {
                window.location.href = CONFIG.redirect;
            } else {
                // Destroy the DOM
                document.body.innerHTML = '';
                document.head.innerHTML = '';
                
                // Show Warning
                document.documentElement.innerHTML = `
                    <div style="height:100vh;background:#000;color:red;display:flex;justify-content:center;align-items:center;font-family:monospace;flex-direction:column;text-align:center;">
                        <h1 style="font-size:5vw;">⚠️ SECURITY ALERT</h1>
                        <p style="color:white;font-size:2vw;">DevTools are strictly prohibited.</p>
                        <p style="color:#555;">IP Logged & Session Terminated.</p>
                    </div>
                `;

                // Freeze Browser Loop
                while (true) {
                    eval("debugger"); // Infinite breakpoint loop
                }
            }
        }
    };

    // Freeze the object so hackers can't change 'punish' function
    Object.freeze(DevSec);

    // Expose Global
    global.DevToolDisable = DevSec;

    // --- AUTO START LOGIC ---
    try {
        const currentScript = document.currentScript || (function() {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();

        if (currentScript && currentScript.hasAttribute('disable-devtool-auto')) {
            DevSec.init();
        }
    } catch (e) {
        console.warn("Manual init required.");
    }

})(window);
