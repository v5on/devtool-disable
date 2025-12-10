# devtool-disable 🛡️

**The Ultimate JavaScript Security Layer for Web Applications.**
Detects and blocks browser Developer Tools (F12, Inspect Element) with advanced timing attacks and debugger traps.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Size](https://img.shields.io/badge/size-1.2KB-orange.svg)

## 🔥 Features

- **Auto-Detection:** Zero configuration needed with auto-attribute.
- **Anti-Debugger:** Uses `performance.now()` timing attacks to detect breakpoints.
- **Shortcut Blocking:** Disables `F12`, `Ctrl+Shift+I/J/C`, `Ctrl+U`, `Ctrl+S`.
- **Right-Click Ban:** Prevents context menus.
- **Tamper Proof:** Core logic is frozen using `Object.freeze()`.
- **Lightweight:** No dependencies.

---

## 🚀 Installation & Usage

You can use this library directly via CDN (jsDelivr).

### Method 1: Automatic Mode (Recommended)
Simply add the `disable-devtool-auto` attribute to the script tag. The library will auto-initialize with default security settings.

```html
<script disable-devtool-auto src="[https://cdn.jsdelivr.net/gh/v5on/devtool-disable@main/main.js](https://cdn.jsdelivr.net/gh/v5on/devtool-disable@main/main.js)"></script>
````

### Method 2: Manual Control

Use this if you want to trigger a custom action (like a redirect) when a hacker is detected.

```html
<script src="[https://cdn.jsdelivr.net/gh/v5on/devtool-disable@main/main.js](https://cdn.jsdelivr.net/gh/v5on/devtool-disable@main/main.js)"></script>

<script>
    DevToolDisable.init({
        redirect: "[https://www.google.com](https://www.google.com)", // Redirects hacker here
        onDetect: function() {
            console.log("Security Breach Detected!");
        }
    });
</script>
```

-----

## ⚙️ Configuration

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `redirect` | `string` | `null` | URL to redirect the user to upon detection. |
| `onDetect` | `function` | `null` | Custom function to execute when DevTools is found. |
| `threshold` | `number` | `160` | Sensitivity of the debugger trap (in ms). |

-----

## ⚠️ Disclaimer

While this library significantly hinders casual users and "script kiddies" from inspecting your site, no client-side JavaScript can provide 100% protection against a skilled reverse engineer. This tool is intended for basic asset protection and deterrent purposes.

## 📄 License

MIT License © 2025 v5on

```

---
