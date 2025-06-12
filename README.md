
# 🖼️ OpenD – Web3 NFT Marketplace using DSJ Tokens

**OpenD** is a fully decentralized **NFT marketplace** built on the **Internet Computer Protocol (ICP)**. Users can **mint**, **buy**, and **sell NFTs**, all using **DSJ Tokens** — a fungible token created in a separate Web3 project [DSJ Token](https://github.com/Shubhamjha31/DSJ-Token).

The platform showcases how smart contracts, custom tokens, and NFTs can work together in a trustless, blockchain-native application with no centralized backend.

---

## 🚀 Key Features

- 🎨 **Mint NFTs** with custom metadata and image
- 🛍️ **List NFTs for sale** in a decentralized marketplace
- 💸 **Buy NFTs** using DSJ Tokens
- 🔐 NFTs are **tied to Principal IDs** for ownership
- 🔄 Integrates seamlessly with [DSJ Token] for payments
- 🌐 Fully on-chain logic written in **Motoko**

---

## 🛠 Tech Stack

| Layer            | Technology                              |
|------------------|------------------------------------------|
| Smart Contracts  | [Motoko](https://internetcomputer.org/motoko) |
| Blockchain       | [Internet Computer (DFINITY)](https://dfinity.org) |
| Frontend         | [React.js](https://react.dev)            |
| Token Integration| Custom DSJ Fungible Token                |
| Dev Tools        | DFX SDK, Candid UI, VS Code              |

---

## 📦 Installation & Setup (Local)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Shubhamjha31/OpenD.git
   cd OpenD
   ```

2. **Start the Local Replica**
   ```bash
   dfx start --background
   ```

3. **Deploy Canisters**
   ```bash
   dfx deploy
   ```

4. **Start the Frontend**
   ```bash
   npm install
   npm start
   ```

---

## 💡 Concepts Implemented

- 🧠 Inter-canister communication (NFT ↔ DSJ Token)
- 🔐 Principal ID-based access control
- 🖼 NFT metadata & ownership handling
- 🛠 Decentralized application logic (dApp)
- 🔄 Frontend-to-smart-contract integration with React

---

## 🔗 Related Projects

- 🪙 [DSJ Token – Fungible Token System](https://github.com/Shubhamjha31/DSJ-Token)

---

## 🤝 Contributing

Feel free to open issues, suggest features, or contribute improvements.  
Let’s build the decentralized future together!

---

## 👨‍💻 Author

**Shubham Jha**  
[LinkedIn](https://www.linkedin.com/in/shubham-jha3107) • [GitHub](https://github.com/Shubhamjha31)
