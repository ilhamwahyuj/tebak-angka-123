# 🎮 Tebak Angka 123 - Game with Login System

Sebuah game tebak angka sederhana berbasis web yang dilengkapi dengan sistem registrasi dan login pengguna. Data pengguna dan statistik game disimpan di `localStorage` browser, sehingga tidak memerlukan backend server.

## Fitur Utama

- **Registrasi Pengguna**: Pengguna baru dapat mendaftar dengan nama, umur, dan domisili.
- **Login Pengguna**: Pengguna yang sudah terdaftar dapat login untuk bermain.
- **Daftar Pengguna**: Menampilkan semua pengguna yang terdaftar dalam bentuk tabel.
- **Game Tebak Angka "123"**: 
  - Angka rahasia terdiri dari permutasi angka 1, 2, dan 3 (misal: 123, 312, 231).
  - Tebakan harus 3 digit dengan angka yang tidak berulang.
  - Setiap tebakan salah akan menambah hitungan sesi.
  - Jika tebakan benar, total kemenangan bertambah dan rekor salah terbanyak diperbarui.
- **Statistik Global**: Jumlah total tebakan benar dan rekor salah terbanyak dalam satu permainan disimpan secara global untuk semua pengguna.
- **Logout**: Pengguna dapat keluar dan kembali ke halaman login.

## Teknologi yang Digunakan

- **HTML5**: Struktur halaman.
- **CSS3**: Styling dengan gradien, efek blur, dan desain modern.
- **JavaScript (Vanilla)**: Logika game, manajemen state, dan interaksi dengan localStorage.
- **Font Awesome 6**: Ikon-ikon menarik.
- **Google Fonts (Quicksand)**: Tipografi yang bersih dan modern.


