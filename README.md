# OPNet Vesting Dashboard

A decentralized vesting and staking dashboard built for the OPNet ecosystem (Bitcoin L1 Smart Contracts). This application allows users to stake their **tBTC (Testnet Bitcoin)** into vesting pools to earn APR rewards.

## 🌟 Features

- **User Controlled Vesting Pools**: Users can create their own vesting positions by locking tBTC.
- **Dynamic APR Rewards**: Earn higher rewards for longer lock durations:
  - **1 Day**: 5% APR
  - **3 Months**: 12% APR
  - **6 Months**: 20% APR
  - **12 Months**: 40% APR
- **Real-Time Wallet Integration**:
  - Connects with **OP_Wallet**.
  - Displays real-time **tBTC balance**.
  - Supports percentage-based staking (25%, 50%, 75%, Max).
- **Vesting Management**:
  - Track vesting progress in real-time.
  - View locked amounts and earned rewards.
  - Claim principal + rewards upon maturity.
- **Bitcoin L1 Transactions**:
  - Signs and broadcasts real Bitcoin transactions via OP_Wallet.
  - Fully decentralized and non-custodial.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Blockchain Integration**: [OPNet MCP](https://opnet.org/) (Simulated SDK for demo)
- **Wallet**: OP_Wallet (Bitcoin Smart Contract Wallet)

## 🚀 Getting Started

### Prerequisites

1.  **Node.js** (v18 or higher) installed.
2.  **OP_Wallet Extension** installed in your browser.
    - [Download OP_Wallet](https://opnet.org/)
    - Switch network to **Regtest** or **Testnet** (as per environment).
    - Fund your wallet with tBTC from the [OPNet Faucet](https://faucet.opnet.org/).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/learning1997/vesting_dashboard.git
    cd vesting-dashboard
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

This project is optimized for deployment on **Netlify** or **Vercel**.

### Deploy to Netlify

1.  Push your code to a GitHub repository.
2.  Log in to Netlify and click **"New site from Git"**.
3.  Select your repository.
4.  **Build Command**: `npm run build`
5.  **Publish Directory**: `.next` (or let Netlify auto-detect Next.js settings).
6.  Click **Deploy**.

## 📝 Usage Guide

1.  **Connect Wallet**: Click the "Connect Wallet" button in the top right.
2.  **Check Balance**: Ensure you have tBTC in your wallet.
3.  **Create Position**:
    - Enter the amount of tBTC to lock.
    - Select a duration (e.g., 3 Months for 12% APR).
    - Click "Create Position".
    - **Sign & Confirm** the transaction in your OP_Wallet popup.
4.  **Track & Claim**:
    - Scroll down to "Your Vesting Positions".
    - Watch the progress bar fill up.
    - Once the vesting period ends, click **Claim** to withdraw your tBTC + Rewards.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
