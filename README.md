# 🎰 Decentralized Lottery System: Full-Stack Web3 Application

Proyek ini adalah implementasi sistem undian terdesentralisasi yang memanfaatkan teknologi blockchain Ethereum. Terdiri dari **Smart Contract** yang aman sebagai mesin logika dan **Web3 Frontend** sebagai antarmuka pengguna. Proyek ini dikembangkan sebagai bagian dari penelitian tesis mengenai transparansi sistem berbasis digital.

## 🏗️ Struktur Repositori

Repositori ini menggunakan struktur monorepo untuk memisahkan logika backend blockchain dan antarmuka pengguna:

* **`smartcontract/`**: Berisi kode sumber Solidity, script deploy menggunakan Hardhat, dan unit testing untuk logika lottery.
* **`frontend/`**: Berisi aplikasi web berbasis Next.js 15 yang terintegrasi dengan Wagmi untuk interaksi blockchain.

---

## 🛠️ Tech Stack & Integrasi

### 1. Smart Contract (Solidity & Hardhat)

* **Chainlink VRF (v2.5)**: Memberikan angka acak yang terverifikasi secara on-chain untuk pemilihan pemenang yang adil.
* **Chainlink Automation**: Menjalankan fungsi undian secara otomatis berdasarkan interval waktu tanpa campur tangan manusia.

### 2. Frontend (Next.js & Web3)

* **Wagmi 3 & Viem**: Library utama untuk koneksi wallet (MetaMask) dan pembacaan data kontrak secara real-time.
* **Tailwind CSS**: Desain antarmuka modern dengan pendekatan *glassmorphism*.
* **Shadcn UI & Lucide React**: Komponen UI dan ikonografi profesional untuk pengalaman pengguna yang intuitif.

---

## 🚀 Cara Menjalankan Proyek

### Folder: `smartcontract`

1. Masuk ke direktori: `cd smartcontract`
2. Selanjutnya ikuti tutorialnya

### Folder: `frontend`

1. Masuk ke direktori: `cd frontend`
2. Selanjutnya ikuti tutorialnya
---

## 📝 Alur Kerja Sistem (System Flow)

1. **Entry**: Pemain masuk dengan membayar *Entrance Fee* (misal: 0.01 ETH) melalui Smart Contract.
2. **Trigger**: Chainlink Automation mengecek apakah waktu interval sudah tercapai dan jumlah minimum pemain terpenuhi.
3. **Randomness**: Kontrak meminta angka acak ke Chainlink VRF.
4. **Settlement**: Pemenang dipilih secara acak, dan hadiah otomatis dikirimkan ke alamat dompet pemenang.

---

### Depedencies Penting

1. **Hardhat 3**: hardhat untuk contract development. docs [hardhat3](https://hardhat.org/docs)
2. **Wagmi 3**: wagmi untuk interaksi contract di frontend: docs [wagmi](https://wagmi.sh/)
3. **Next js 16**: untuk frontend development.
4. **Chainlink VRF 2.5**: untuk automation randomness pemenang lottery. docs [chainlink.vrf](https://docs.chain.link/vrf)
5. **Chainlink Automation 2.1**: untuk automation checkup aplikasi. docs [chainlink.automation](https://docs.chain.link/chainlink-automation)

## 👤 Author

* **Name**: Rizky Cahyono Putra
