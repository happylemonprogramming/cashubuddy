# Cashu Webpack Bundle

This project provides a pure JavaScript bundle of [cashu-ts](https://github.com/cashubtc/cashu-ts), making it easy to integrate Cashu functionalities into web applications without needing additional dependencies or module bundlers.

## 🚀 Quick Start
To use the CashuBuddy Webpack bundle in your web application, simply include the script in your HTML file:

```html
<script src="https://cashubuddy.pages.dev/bundle.js"></script>
```

This will expose a global `CashuBuddy` object that you can use in your JavaScript code.

## 📖 Usage
Once the script is loaded, you can interact with the Cashu functionality directly:

```javascript
// Initialize wallet
const wallet = await CashuBuddy.initializeWallet('https://mint.minibits.cash/Bitcoin');
console.log("Wallet initialized:", wallet);

// Create quote
const mintQuote = await CashuBuddy.createQuote(wallet, parseInt(amount));
console.log("Mint Quote received:", mintQuote);
```

More detailed examples and API documentation can be found in the `cashu-ts` repository: [cashu-ts](https://github.com/cashubtc/cashu-ts).

## 📌 Features
- Pure JavaScript bundle – no need for additional package managers.
- Easy integration via `<script>` tag.
- Powered by `cashu-ts` for seamless Cashu functionality.

## 📝 License
This project follows the same license as `cashu-ts`. See the [LICENSE](./LICENSE) file for details.

---

For any issues or feature requests, feel free to open an issue on [GitHub](https://github.com/happylemonprogramming/cashubuddy/issues).

