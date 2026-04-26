const pool = require('../config/db');

exports.getBooks = async (req, res) => {
  const { search } = req.query;
  console.log('Fetching books, search term:', search);
  try {
    let query = 'SELECT * FROM books';
    let params = [];
    if (search) {
      query += ' WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?';
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    }
    const [rows] = await pool.query(query, params);
    console.log(`Found ${rows.length} books`);
    res.json(rows);
  } catch (error) {
    console.error('Fetch books error:', error);
    res.status(500).json({ error: 'Failed to fetch books', details: error.message });
  }
};

exports.addBook = async (req, res) => {
  const { title, author, isbn, genre, available_copies } = req.body;
  console.log('Adding book:', { title, author, isbn, genre, available_copies });
  
  // Basic validation
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and Author are required' });
  }

  // Handle available_copies (ensure it's a number or null)
  let copies = parseInt(available_copies);
  if (isNaN(copies)) {
    copies = 0; // Default to 0 instead of NaN or null if invalid
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO books (title, author, isbn, genre, available_copies) VALUES (?, ?, ?, ?, ?)',
      [title, author, isbn, genre, copies]
    );
    console.log('Book added successfully with ID:', result.insertId);
    res.status(201).json({ message: 'Book added successfully', bookId: result.insertId });
  } catch (error) {
    console.error('Add book error:', error.message);
    res.status(500).json({ error: 'Failed to add book', details: error.message });
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, genre, available_copies } = req.body;
  console.log(`Updating book ID ${id}:`, { title, author, isbn, genre, available_copies });
  
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and Author are required' });
  }

  let copies = parseInt(available_copies);
  if (isNaN(copies)) {
    copies = 0;
  }

  try {
    const [result] = await pool.query(
      'UPDATE books SET title = ?, author = ?, isbn = ?, genre = ?, available_copies = ? WHERE id = ?',
      [title, author, isbn, genre, copies, id]
    );
    console.log(`Book ID ${id} updated successfully`);
    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Update book error:', error.message);
    res.status(500).json({ error: 'Failed to update book', details: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM books WHERE id = ?', [id]);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book', details: error.message });
  }
};
