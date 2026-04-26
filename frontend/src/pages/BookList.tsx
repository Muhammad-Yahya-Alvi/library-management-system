import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, Plus, Edit, Trash2, Book as BookIcon, 
  User as UserIcon, X, Save, AlertCircle,
  Filter, ArrowRight
} from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  available_copies: number;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Partial<Book>>({});
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, [search]);

  const fetchBooks = async () => {
    try {
      const response = await api.get(`/books?search=${search}`);
      setBooks(response.data);
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      fetchBooks();
    } catch (err) {
      alert('Failed to delete book');
    }
  };

  const handleOpenModal = (book?: Book) => {
    if (!isAuthenticated) {
      alert('Please login to manage books');
      return;
    }
    setCurrentBook(book || { title: '', author: '', isbn: '', genre: '', available_copies: 1 });
    setIsModalOpen(true);
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (currentBook.id) {
        await api.put(`/books/${currentBook.id}`, currentBook);
      } else {
        await api.post('/books', currentBook);
      }
      setIsModalOpen(false);
      fetchBooks();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save book');
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">
            Library <span className="text-primary-600">Catalog</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-lg leading-relaxed">
            Manage your collection with ease. Search, discover, and organize your favorite reads.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3.5 rounded-2xl transition-all shadow-xl shadow-primary-200/60 font-bold transform active:scale-95 sm:w-auto"
        >
          <Plus size={20} />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group max-w-3xl">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
          <Search size={22} />
        </div>
        <input
          type="text"
          placeholder="Find a book by title, author, or genre..."
          className="w-full pl-14 pr-6 py-4.5 rounded-3xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all shadow-soft text-lg bg-white placeholder:text-slate-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <div className="hidden sm:flex items-center space-x-1 px-3 py-1 bg-slate-100 rounded-xl text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Filter size={12} />
            <span>Filters</span>
          </div>
        </div>
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-primary-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {books.map((book) => (
            <div key={book.id} className="group bg-white rounded-[2rem] shadow-soft hover:shadow-soft-lg transition-all duration-500 overflow-hidden border border-slate-100 flex flex-col hover:-translate-y-1">
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-purple-500/20 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity">
                  <BookIcon size={80} className="text-primary-600" />
                </div>
                {isAuthenticated && (
                  <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <button 
                      onClick={() => handleOpenModal(book)}
                      className="p-2.5 bg-white/90 backdrop-blur shadow-sm text-slate-600 hover:text-primary-600 rounded-xl transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(book.id)}
                      className="p-2.5 bg-white/90 backdrop-blur shadow-sm text-slate-600 hover:text-red-500 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-primary-600 shadow-sm">
                    {book.genre || 'General'}
                  </span>
                </div>
              </div>

              <div className="p-7 flex-grow space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-primary-600 transition-colors line-clamp-1">
                    {book.title}
                  </h3>
                  <div className="flex items-center text-slate-400 font-medium text-sm">
                    <UserIcon size={14} className="mr-1.5" />
                    <span className="truncate">{book.author}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Availability</span>
                    <div className="flex items-center space-x-1.5">
                      <div className={`w-2 h-2 rounded-full ${book.available_copies > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}></div>
                      <span className={`text-sm font-bold ${book.available_copies > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {book.available_copies > 0 ? `${book.available_copies} Copies` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-primary-600 transition-colors">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {books.length === 0 && !loading && (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-soft">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookIcon size={40} className="text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">No books found</h2>
          <p className="text-slate-400 mt-2 font-medium">Try adjusting your search criteria or add a new book.</p>
        </div>
      )}

      {/* Modern Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-scaleUp border border-white">
            <div className="px-8 pt-8 pb-4 flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 leading-none">
                  {currentBook.id ? 'Refine Details' : 'Add to Collection'}
                </h2>
                <p className="text-sm text-slate-400 font-medium">Please fill in the information below</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveBook} className="p-8 space-y-6">
              {error && (
                <div className="bg-red-50 text-red-500 px-5 py-3 rounded-2xl flex items-center space-x-3 border border-red-100 text-sm font-semibold">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all font-medium text-slate-800"
                    value={currentBook.title || ''}
                    onChange={(e) => setCurrentBook({ ...currentBook, title: e.target.value })}
                    placeholder="Enter book title"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Author</label>
                    <input
                      type="text"
                      required
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all font-medium"
                      value={currentBook.author || ''}
                      onChange={(e) => setCurrentBook({ ...currentBook, author: e.target.value })}
                      placeholder="Author name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Genre</label>
                    <input
                      type="text"
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all font-medium"
                      value={currentBook.genre || ''}
                      onChange={(e) => setCurrentBook({ ...currentBook, genre: e.target.value })}
                      placeholder="e.g. Science Fiction"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ISBN</label>
                    <input
                      type="text"
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all font-medium"
                      value={currentBook.isbn || ''}
                      onChange={(e) => setCurrentBook({ ...currentBook, isbn: e.target.value })}
                      placeholder="ISBN Code"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Copies Available</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all font-bold"
                      value={currentBook.available_copies || 0}
                      onChange={(e) => setCurrentBook({ ...currentBook, available_copies: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[1.5] flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-primary-200 transition-all active:scale-95"
                >
                  <Save size={18} />
                  <span>{currentBook.id ? 'Update Record' : 'Confirm & Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
