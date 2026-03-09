const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

/* API ambil semua buku */

app.get("/books", (req, res) => {

  fs.readFile("books.json", "utf8", (err, data) => {

    if (err) {
      res.status(500).json({ error: "Gagal membaca database" });
      return;
    }

    const books = JSON.parse(data);
    res.json(books.books);

  });

});

/* API tambah buku */

app.post("/books", (req, res) => {

  const { title, author } = req.body;

  fs.readFile("books.json", "utf8", (err, data) => {

    const jsonData = JSON.parse(data);

    const newBook = {
      id: Date.now(),
      title,
      author
    };

    jsonData.books.push(newBook);

    fs.writeFile("books.json", JSON.stringify(jsonData, null, 2), () => {

      res.json(newBook);

    });

  });

});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});