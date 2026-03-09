const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

/* koneksi database */
const db = new sqlite3.Database("./perpustakaan.db", (err) => {
  if (err) {
    console.error("Database gagal terhubung:", err.message);
  } else {
    console.log("Database SQLite terhubung");
  }
});

/* API ambil semua buku */
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

/* API tambah buku */
app.post("/books", (req, res) => {

  const { title, author } = req.body;

  const sql = "INSERT INTO books (title, author) VALUES (?, ?)";

  db.run(sql, [title, author], function(err) {

    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      id: this.lastID,
      title,
      author
    });

  });

});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});