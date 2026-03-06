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
- **Data Persistence**:
  - Uses **Supabase** to store vesting schedules, ensuring data is accessible across devices and browsers.
- **Bitcoin L1 Transactions**:
  - Signs and broadcasts real Bitcoin transactions via OP_Wallet.
  - Fully decentralized and non-custodial.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend/Storage**: [Supabase](https://supabase.com/)
- **Blockchain Integration**: [OPNet MCP](https://opnet.org/)
- **Wallet**: OP_Wallet (Bitcoin Smart Contract Wallet)

## 🚀 Getting Started

### Prerequisites

1.  **Node.js** (v18 or higher) installed.
2.  **OP_Wallet Extension** installed in your browser.
3.  **Supabase Project** (Optional for local dev if using provided demo keys, required for production).

### Database Setup (Supabase)

To enable data persistence, you need to set up a Supabase database.

1.  Create a new project on [Supabase](https://supabase.com/).
2.  Go to the **SQL Editor** in your Supabase dashboard.
3.  Run the following SQL query to create the `vesting_schedules` table:

    ```sql
    CREATE TABLE IF NOT EXISTS vesting_schedules (
        id TEXT PRIMARY KEY,
        recipient TEXT NOT NULL,
        total_amount NUMERIC NOT NULL,
        start_time BIGINT NOT NULL,
        cliff_duration BIGINT NOT NULL,
        vesting_duration BIGINT NOT NULL,
        amount_claimed NUMERIC DEFAULT 0,
        apr NUMERIC NOT NULL,
        reward_amount NUMERIC NOT NULL,
        tx_hash TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Index for faster queries by recipient
    CREATE INDEX IF NOT EXISTS idx_vesting_schedules_recipient ON vesting_schedules(recipient);
    ```

4.  Copy your **Project URL** and **anon public key** from the API settings.
5.  Add them to your `.env.local` file (or deployment environment variables).

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

3.  Set up Environment Variables:
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

This project is optimized for deployment on **Netlify** or **Vercel**.

### Deploy to Netlify

1.  Push your code to a GitHub repository.
2.  Log in to Netlify and click **"New site from Git"**.
3.  Select your repository.
4.  **Build Command**: `npm run build`
5.  **Publish Directory**: `.next` (or let Netlify auto-detect Next.js settings).
6.  **Environment Variables**:
    - Add `NEXT_PUBLIC_SUPABASE_URL`
    - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7.  Click **Deploy**.

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
