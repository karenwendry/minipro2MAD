import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type Book = {
  id: string;
  title: string;
  author: string;
};

export default function HomeScreen() {

  const [books, setBooks] = useState<Book[]>([
    { id: '1', title: 'Algoritma dan Pemrograman', author: 'Rinaldi Munir' },
    { id: '2', title: 'Struktur Data', author: 'Abdul Kadir' },
    { id: '3', title: 'Basis Data', author: 'Connolly & Begg' },
    { id: '4', title: 'Artificial Intelligence', author: 'Stuart Russell' },
    { id: '5', title: 'Machine Learning', author: 'Tom Mitchell' }
  ]);

  const renderItem = ({ item }: { item: Book }) => (
    <View style={styles.bookCard}>
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>Penulis: {item.author}</Text>
    </View>
  );

  return (
    <View style={styles.container}>

      <Text style={styles.header}>
        📚 Daftar Buku Perpustakaan
      </Text>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Tambah Buku</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fcedd3',
    padding: 20
  },

  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#102a6b'
  },

  bookCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#102a6b'
  },

  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#102a6b'
  },

  bookAuthor: {
    fontSize: 14,
    color: '#555',
    marginTop: 4
  },

  addButton: {
    backgroundColor: '#102a6b',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },

  addButtonText: {
    color: '#fcedd3',
    fontWeight: 'bold',
    fontSize: 16
  }

});