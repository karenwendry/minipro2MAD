const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const SECRET_KEY = 'rahasia_super_aman_kampus_123'; // Kunci rahasia untuk JWT

// === 1. SETUP DATABASE SQLITE ===
// File perpustakaan.db akan otomatis terbuat di folder backend Anda
const db = new sqlite3.Database('./perpustakaan.db', (err) => {
    if (err) console.error(err.message);
    console.log('✅ Terkoneksi ke database SQLite.');
});

// Membuat Tabel User dan Memasukkan Akun Dummy
db.serialize(async () => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        identifier TEXT UNIQUE,
        password_hash TEXT,
        role TEXT
    )`);

    // Kita hash password "password123" agar aman
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Masukkan 1 Mahasiswa (NIM: 12345) dan 1 Admin (ID: admin01)
    const insertStmt = db.prepare(`INSERT OR IGNORE INTO users (identifier, password_hash, role) VALUES (?, ?, ?)`);
    insertStmt.run('12345', hashedPassword, 'mahasiswa');
    insertStmt.run('admin01', hashedPassword, 'admin');
    insertStmt.finalize();
});

// === 2. ENDPOINT LOGIN ===
app.post('/api/login', (req, res) => {
    const { identifier, password, role } = req.body;

    // Cari user di database
    db.get(`SELECT * FROM users WHERE identifier = ? AND role = ?`, [identifier, role], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Terjadi kesalahan server' });
        
        if (!user) {
            return res.status(401).json({ error: 'NIM/ID atau Role salah!' });
        }

        // Bandingkan password yang diketik dengan password hash di database
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Kata sandi salah!' });
        }

        // Buat JWT Token
        const token = jwt.sign(
            { id: user.id, identifier: user.identifier, role: user.role }, 
            SECRET_KEY, 
            { expiresIn: '2h' } // Sesi habis dalam 2 jam
        );

        res.json({
            message: 'Login Berhasil',
            token: token,
            user: { identifier: user.identifier, role: user.role }
        });
    });
});

// === 3. JALANKAN SERVER ===
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});