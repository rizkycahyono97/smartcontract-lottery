# 🎰 Decentralized Ethereum Lottery DApp

Selamat datang di repositori frontend **Decentralized Lottery**, sebuah platform undian berbasis blockchain yang dibangun di atas jaringan **Ethereum Sepolia Testnet**. Project ini merupakan bagian dari implementasi tesis yang mengutamakan transparansi mutlak dan keamanan _on-chain_.

## 🚀 Overview

Aplikasi ini adalah **Front-End** dari smartcontract **Lottery** memungkinkan pengguna untuk berpartisipasi dalam undian menggunakan mata uang kripto (ETH). Seluruh logika permainan dikendalikan oleh **Smart Contract** yang sudah diverifikasi, memastikan tidak ada manipulasi dari pihak manapun.

### Fitur Utama

- **Decentralized Fairness**: Menggunakan **Chainlink VRF (Verifiable Random Function)** untuk pemilihan pemenang yang terbukti acak secara kriptografis.
- **Automated Execution**: Menggunakan **Chainlink Automation** untuk menjalankan proses undian secara otomatis tanpa intervensi admin.
- **Web3 Integration**: Integrasi mulus dengan MetaMask dan wallet lainnya menggunakan **Wagmi** dan **RainbowKit**.
- **Real-time UI**: Status undian (OPEN/CALCULATING), jumlah pemain, dan pemenang terbaru diperbarui secara otomatis dari blockchain.

---

## 🛠️ Stack Teknologi

| Kategori                     | Teknologi                          |
| ---------------------------- | ---------------------------------- |
| **Framework**                | Next.js 15 (App Router)            |
| **Blockchain Library**       | Wagmi, Viem                        |
| **Smart Contract Interface** | Solidity (Ethereum Sepolia)        |
| **Styling**                  | Tailwind CSS, Lucide React (Icons) |
| **UI Components**            | Shadcn UI                          |
| **Oracles**                  | Chainlink VRF & Automation         |

---

## 📂 Struktur Proyek

```text
.
├── constants/              # ABI Smart Contract dan alamat kontrak
├── src/
│   ├── app/                # Next.js App Router (Layouting & Routing)
│   │   ├── (home)/         # Landing page dengan Hero Section
│   │   └── lottery/        # Dashboard utama interaksi lottery
│   ├── components/         # Komponen UI modular
│   │   ├── lottery/        # Logic khusus (EnterLottery, EntranceStatus)
│   │   └── wallet/         # Web3 connection logic (ConnectWallet, Observer)
│   ├── config/             # Konfigurasi Wagmi dan detail Contract
│   └── provider/           # Web3 Context Provider
└── components.json         # Konfigurasi Shadcn UI

```

---

## ⚙️ Cara Menjalankan

### 1. Prasyarat

- Node.js v18+
- pnpm
- Wallet MetaMask dengan saldo **Sepolia ETH**

### 2. Instalasi

Clone repositori dan instal dependensi:

```bash
pnpm install

```

### 3. Konfigurasi Environment

Buat file `.env.local` dan isi dengan konfigurasi berikut (lihat `.env.example`):

```env
NEXT_PUBLIC_PROJECT_ID=PROJECTIDFROM => https://reown.com/
NEXT_PUBLIC_RAFFLE_ADDRESS=CONTRACTADDRESS

```

### 4. Konfigurasi Constants

Masukan **ABI** hasil compile dari contract lottery di directory _./constants/raffle-abi.json_, berikut contohnya:

```bash
{
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "vRFConsumerBaseV2Plus",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "entranceFee",
          "type": "uint256"
        },
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    }
  ]
}
```

### 5. Jalankan Development Server

```bash
pnpm dev

```

Aplikasi akan berjalan di [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000).

---

## 🧠 Alur Permainan (User Flow)

1. **Connect Wallet**: Pengguna menghubungkan wallet ke jaringan Sepolia.
2. **Check Status**: Melihat _Entrance Fee_ dan jumlah peserta saat ini.
3. **Enter Raffle**: Pengguna membayar biaya masuk melalui transaksi Smart Contract.
4. **Wait for Upkeep**: Setelah interval waktu habis dan syarat terpenuhi, Chainlink Automation memicu pemilihan pemenang.
5. **Winner Selection**: Chainlink VRF mengirimkan angka acak secara _callback_ ke kontrak untuk menentukan pemenang.
6. **Claim/Transfer**: Hadiah dikirimkan secara otomatis atau dicatat untuk ditarik oleh pemenang.

---

## 📜 Developer

- \*Developer\*\*: [rizkycahyono97](https://github.com/rizkycahyono97)
