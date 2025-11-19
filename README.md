# K-423X Taskify  
### Enterprise-Grade Task Management Platform (Web • Mobile • API)

K-423X Taskify adalah platform manajemen tugas lintas platform yang dikembangkan dengan standar enterprise. Sistem ini terdiri dari aplikasi Web, Mobile, dan Backend API yang terintegrasi melalui arsitektur layanan modern berbasis REST API, dengan keamanan JWT Authentication dan penyimpanan data pada PostgreSQL. Platform ini dirancang untuk menghadirkan sinkronisasi real-time, stabilitas, skalabilitas, serta pengalaman pengguna yang konsisten di seluruh perangkat.

------------------------------------------------------------
# 🎯 Tujuan Sistem
- Menyediakan solusi manajemen tugas yang aman, responsif, dan dapat diskalakan.
- Menghadirkan integrasi antara Web dan Mobile melalui API tunggal.
- Memberikan autentikasi aman dengan Token-Based Authentication (JWT).
- Memastikan maintainability dengan struktur modular.

------------------------------------------------------------
# 🏗 Arsitektur Proyek
/api → Backend (Node.js, Express, JWT, PostgreSQL)
/web → Website Next.js
/mobile → Aplikasi Mobile Expo React Native

------------------------------------------------------------
# 🔧 Teknologi Utama

### Backend API
- Node.js (v18+ wajib)
- Express.js
- PostgreSQL
- JSON Web Token (JWT)
- bcrypt
- pg driver
- Nodemon

### Web App
- Next.js (App Router)
- React
- next/font – Geist

### Mobile App
- Expo React Native
- Metro Bundler
- Expo Go / Android Emulator / iOS Simulator

------------------------------------------------------------
# 📌 Prasyarat Instalasi

Perangkat wajib memiliki:

| Tools / Software | Kebutuhan |
|------------------|-----------|
| Node.js v18 atau lebih | Wajib |
| npm | Wajib |
| PostgreSQL | Wajib |
| Expo CLI (opsional tapi disarankan) | Disarankan |
| Android Emulator / Expo Go | Opsional |
| Git | Wajib |

Cek versi Node:
node -v

------------------------------------------------------------
# 🚀 1. Instalasi & Konfigurasi Backend API

Masuk ke folder API:
cd api
npm install

Buat database PostgreSQL:
CREATE DATABASE taskify_db;

Buat file .env:
PORT=5000
DATABASE_URL=postgresql://postgres:kiana@localhost:5432/taskify_db
JWT_SECRET=supersecretkey

Menjalankan API:
npm run dev
atau:
npm start

API berjalan pada:
http://localhost:5000

------------------------------------------------------------
# 🌐 2. Menjalankan Website (Next.js)

Masuk folder Web:
cd web
npm install
npm run dev

Akses website:
http://localhost:3000

Pastikan base URL API menunjuk ke:
http://localhost:5000

------------------------------------------------------------
# 📱 3. Menjalankan Mobile App (Expo)

Masuk folder Mobile:
cd mobile
npm install
npx expo start

Jalankan aplikasi melalui:
- Expo Go (scan QR)
- Android Emulator
- iOS Simulator

Catatan penting:
API URL pada mobile harus diarahkan ke IP komputer, bukan localhost.
Contoh:
http://192.168.1.10:5000

------------------------------------------------------------
# 🔐 Autentikasi

Sistem menggunakan mekanisme autentikasi JWT.
Header yang wajib dikirim:
Authorization: Bearer <token>

------------------------------------------------------------
# 📡 REST API Overview

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| POST | /auth/login | Login & mendapatkan token |
| POST | /auth/register | Registrasi pengguna |
| GET | /tasks | Mendapatkan semua tugas |
| POST | /tasks | Menambah tugas baru |
| PUT | /tasks/:id | Memperbarui tugas |
| DELETE | /tasks/:id | Menghapus tugas |

------------------------------------------------------------
# 🛠 Checklist Pra-Deployment

- Node.js v18+ terpasang
- PostgreSQL terinstal
- Database taskify_db dibuat
- File .env dikonfigurasi
- Backend berjalan pada port 5000
- Web client terhubung ke API
- Mobile app terhubung ke IP server API
- Semua dependencies telah di-install

------------------------------------------------------------
# 🤝 Kontribusi

Langkah kontribusi:
git checkout -b fitur-baru
git commit -m "Menambahkan fitur baru"
git push origin fitur-baru

Lalu buat Pull Request melalui GitHub.

------------------------------------------------------------
# 📄 Lisensi
Project ini menggunakan lisensi MIT.

------------------------------------------------------------
# 👤 Pengembang
Tokisaki  
GitHub: https://github.com/TokisakiK-423
