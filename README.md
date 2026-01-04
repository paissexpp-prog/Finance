# Finance Dashboard - Aplikasi Manajemen Keuangan Modern

Aplikasi web modern untuk mengelola keuangan pribadi dengan fitur grafik real-time, riwayat transaksi, dan sistem user management.

## 🎯 Fitur Utama

### Dashboard & Statistik
- **Saldo Bulanan**: Tracking saldo yang di-reset setiap bulan
- **Pemasukan Bulanan**: Total pemasukan bulan ini (di-reset bulanan)
- **Pengeluaran Bulanan**: Total pengeluaran bulan ini (di-reset bulanan)
- **Total Pengeluaran Tahunan**: Akumulasi pengeluaran sepanjang tahun (tidak di-reset)

### Grafik & Visualisasi
- **Grafik 7 Hari**: Visualisasi transaksi 7 hari terakhir
- **Grafik 30 Hari**: Visualisasi transaksi 30 hari terakhir
- **Grafik 1 Tahun**: Visualisasi transaksi sepanjang tahun
- **Tipe Grafik**: Pilih antara Line Chart, Bar Chart, atau Pie Chart

### Manajemen Transaksi
- **Catat Transaksi**: Tambah transaksi baru (pemasukan/pengeluaran)
- **Edit Transaksi**: Ubah transaksi yang sudah tercatat
- **Hapus Transaksi**: Hapus transaksi yang tidak perlu
- **Riwayat Transaksi**: Lihat semua transaksi dengan filter tipe

### Autentikasi & User Management
- **Login System**: Sistem login dengan username dan password
- **Owner Account**: Akun khusus untuk mengelola user
  - Username: `paisx`
  - Password: `2009`
- **User Management**: Owner dapat membuat dan menghapus user account
- **Role-based Access**: Fitur berbeda untuk owner dan user biasa

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Routing**: Wouter
- **Charts**: Recharts
- **State Management**: React Context API
- **Storage**: LocalStorage (JSON-based)
- **Build Tool**: Vite
- **Deployment**: Vercel

## 📦 Instalasi & Setup

### Prerequisites
- Node.js 18+ dan npm/pnpm

### Development

```bash
# Clone repository
git clone <repository-url>
cd finance-app

# Install dependencies
npm install
# atau
pnpm install

# Run development server
npm run dev
# atau
pnpm dev

# Server akan berjalan di http://localhost:3000
```

### Production Build

```bash
# Build untuk production
npm run build
# atau
pnpm build

# Preview production build
npm run preview
# atau
pnpm preview

# Start production server
npm start
# atau
pnpm start
```

## 🚀 Deployment ke Vercel

### Metode 1: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Metode 2: Via GitHub Integration

1. Push kode ke GitHub repository
2. Login ke [Vercel Dashboard](https://vercel.com)
3. Klik "New Project"
4. Import repository GitHub
5. Klik "Deploy"

### Metode 3: Manual Upload

1. Build project: `npm run build`
2. Upload folder `dist/` ke Vercel

## 📁 Struktur Project

```
finance-app/
├── client/
│   ├── public/
│   │   ├── index.html
│   │   └── images/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── ChartComponent.tsx
│   │   │   └── ui/
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── TransactionContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── FinanceOverview.tsx
│   │   │   ├── TransactionHistory.tsx
│   │   │   ├── AddTransaction.tsx
│   │   │   ├── EditTransaction.tsx
│   │   │   └── ManageUsers.tsx
│   │   ├── lib/
│   │   │   └── types.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── server/
│   └── index.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── vercel.json
└── README.md
```

## 🔐 Data Storage

Semua data disimpan di **LocalStorage** dalam format JSON:

### Users Storage
```json
{
  "users": [
    {
      "id": "user-1234567890",
      "username": "john_doe",
      "password": "hashedpassword",
      "role": "user",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### Transactions Storage
```json
{
  "transactions": [
    {
      "id": "tx-1234567890",
      "userId": "user-1234567890",
      "type": "income",
      "amount": 5000000,
      "description": "Gaji bulanan",
      "date": "2024-01-01",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

## 👤 Akun Demo

### Owner Account
- **Username**: paisx
- **Password**: 2009
- **Akses**: Dashboard + User Management

### User Account
Buat user baru melalui halaman "Kelola User" setelah login sebagai owner.

## 🎨 Design Philosophy

Aplikasi ini menggunakan **Minimalist Fintech Design** dengan:
- **Warna Utama**: Gradien Biru-Teal untuk kepercayaan dan modernitas
- **Aksen Warna**: Hijau untuk pemasukan, Merah untuk pengeluaran
- **Typography**: Geist Bold untuk heading, Geist Regular untuk body
- **Animasi**: Smooth transitions dan micro-interactions
- **Layout**: Asymmetric dengan sidebar navigation

## 📱 Responsive Design

Aplikasi fully responsive untuk:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🔧 Konfigurasi

### Environment Variables
Tidak ada environment variables yang diperlukan untuk development. Semua data disimpan di LocalStorage.

### Tailwind CSS
Konfigurasi Tailwind CSS ada di `tailwind.config.js`. Custom colors dan themes dapat disesuaikan di `client/src/index.css`.

## 🐛 Troubleshooting

### Build Error
```bash
# Clear cache dan reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Dev Server Not Starting
```bash
# Kill process di port 3000
lsof -ti:3000 | xargs kill -9

# Restart dev server
pnpm dev
```

### Data Tidak Tersimpan
- Pastikan browser memungkinkan LocalStorage
- Clear browser cache dan cookies
- Check browser console untuk error messages

## 📝 Catatan Pengembangan

- Data disimpan di LocalStorage, akan hilang jika cache dibersihkan
- Untuk production, pertimbangkan menggunakan database backend
- Semua transaksi user terpisah berdasarkan user ID
- Reset bulanan dilakukan berdasarkan tanggal sistem

## 🤝 Kontribusi

Untuk kontribusi, silakan buat pull request dengan deskripsi perubahan yang jelas.

## 📄 Lisensi

MIT License - Bebas digunakan untuk keperluan apapun.

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di repository ini.

---

**Dibuat dengan ❤️ menggunakan React + TypeScript + Tailwind CSS**
