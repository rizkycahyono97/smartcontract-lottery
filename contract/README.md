# 🎟️ Decentralized Raffle (Lottery) DApp

Proyek ini adalah implementasi sistem undian terdesentralisasi menggunakan **Chainlink VRF v2.5** untuk keacakan yang terbukti (provable randomness) dan **Chainlink Automation** untuk eksekusi pemilihan pemenang secara otomatis berdasarkan interval waktu.

## 📝 Penjelasan Kontrak

Kontrak `Raffle.sol` memiliki alur kerja sebagai berikut:

1. **Enter Raffle**: User masuk dengan membayar sejumlah `entranceFee`.
2. **Check Upkeep**: Chainlink Automation mengecek apakah waktu sudah habis, ada pemain, dan kontrak memiliki saldo.
3. **Perform Upkeep**: Jika kondisi terpenuhi, kontrak meminta angka acak ke Chainlink VRF.
4. **Fulfill Random Words**: Chainlink VRF mengirimkan angka acak, kontrak menentukan pemenang, mengirimkan saldo kontrak ke pemenang, dan mereset sistem untuk ronde berikutnya.

---

## 📁 Struktur Folder (Hardhat)

```text
.
├── contracts/
│   ├── Raffle.sol
│   └── test
|        |--VRFCoordinatorV2_5Mock.sol
│
├── ignition/
│   ├── modules/
│   │   ├── RaffleLocal.ts
│   │   └── RaffleSepolia.ts
│   │   └── MockV3Coordinator.ts
│   └── deployments/
│
├── scripts/
│
├── test/
│   ├── unit/
│   └── staging/
│
├── hardhat.config.ts
├── package.json
└── README.md
```

---

## 🚀 Setup Project

1. **Masuk ke directory**

```bash
cd smartcontract-lottery/frontend
pnpm install
```

2. **Konfigurasi Environment:**
   saya menggunakan keystore dari hardhat 3:

```env
pnpm hardhat keystore set SEPOLIA_RPC_URL
pnpm hardhat keystore set SEPOLIA_PRIVATE_KEY
pnpm hardhat keystore set ETHERSCAN_API_KEY

```

3. **Konfigurasi Parameters**
   masukan beberapa parameter berdasarkan chainlink anda:

```bash
{
"RaffleSepoliaModule": {
   "vRFConsumerBaseV2Plus": "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B", #default untuk sepolia testnet,
   "entranceFee": "10000000000000000" #0.01 ETH,
   "keyhash": "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae" #didapatkan setelah subscription di https://vrf.chain.link/
   "subscriptionId": "3164034294253410651808734757551068321995027107544723401724235403739742561102", #didapatkan setelah subscription di https://vrf.chain.link/
   "callbackGasLimit": 500000,
   "interval": 60, #interval waktu untuk checkUpKeep chainlink
   "enableNativePayment": true
}
```

---

## 🛠️ Deployment

### 1. Local Network (Hardhat Node)

Sangat berguna untuk pengujian cepat tanpa biaya gas asli.

```bash
# Menjalankan node lokal
pnpm hardhat node

# Deploy ke node lokal menggunakan ignition
pnpm hardhat ignition deploy ./ignition/modules/RaffleLocal.ts --network localhost

```

### 2. Sepolia Testnet

Pastikan kamu memiliki saldo **Sepolia ETH** dan sudah membuat **VRF Subscription** di [vrf.chain.link](https://vrf.chain.link) dan **Chainlink Automation** di [automation.chain.link](https://automation.chain.link).

```bash
pnpm hardhat ignition deploy ./ignition/modules/RaffleSepolia.ts --network sepolia --parameters ./ignition/parameters.json

```

---

## 🚀 Setelah Deployment

### 1. Isi Consumer di Chainlink VRF (https://vrf.chain.link/)

Setelah sukses mendeploy contract di chainlink, masukan address tadi ke **Consumer** di **VRF Chainlink**.

### 2. Isi Alamat Kontrak di Chainlink Automation (https://automation.chain.link/)

Masukan juga address tadi ke **Chainlink Automation**.

---

## 🧪 Etherscan

```bash
pnpm hardhat verify --network sepolia <ALAMAT_KONTRAK> "<vRFConsumerBaseV2Plus>" "<entranceFee>" "<keyhash>" "<subscriptionId>" "<callbackGasLimit>" "<interval>" "<enableNativePayment>"
```

---

## 🧪 Testing

Menjalankan unit test untuk memastikan logika `enterRaffle`, `checkUpkeep`, dan `fulfillRandomWords` berjalan benar:

```bash
pnpm hardhat test

```

---

# 👨‍💻 Author

Rizky Cahyono Putra
GitHub: [https://github.com/rizkycahyono97](https://github.com/rizkycahyono97)

---
