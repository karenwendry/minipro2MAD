const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

/* koneksi ke database */
const db = new sqlite3.Database("./perpustakaan.db", (err) => {
  if (err) {
    console.log("Database gagal terhubung", err.message);
  } else {
    console.log("Database berhasil terhubung");
  }
});

/* endpoint mengambil daftar buku */
app.get("/books", (req, res) => {

  const sql = "SELECT * FROM books";

  db.all(sql, [], (err, rows) => {

    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(rows);

  });

});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});