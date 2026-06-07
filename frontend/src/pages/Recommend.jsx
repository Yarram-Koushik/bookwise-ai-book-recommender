import { useState } from 'react';
import { BookOpen, Sparkles, WandSparkles } from 'lucide-react';
import { recommendBooks } from '../api/bookApi.js';
import BookGrid from '../components/BookGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loader from '../components/Loader.jsx';
import SearchBox from '../components/SearchBox.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import BookCard from '../components/BookCard.jsx';

function Recommend() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRecommend = async () => {
    if (!selectedBook?.title) {
      setError('Please search and select a book first.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await recommendBooks(selectedBook.title, 8);
      setSelectedBook(data.selected_book);
      setRecommendedBooks(data.recommendations || []);
    } catch (apiError) {
      console.error(apiError);
      setError(apiError?.response?.data?.detail?.message || 'Unable to generate recommendations. Please try another book.');
      setRecommendedBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (book) => {
    setSelectedBook(book);
    setRecommendedBooks([]);
    setError('');
  };

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeader
            eyebrow="Find similar books"
            title="Start with a book you already like"
            description="Search for a title, choose the correct match, and let BookWise AI suggest books with similar reader interest."
          />

          <div className="glass-card rounded-[2rem] p-5">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Quick tip</h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Choose a specific result from the dropdown for better recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card mt-4 rounded-[2rem] p-5 sm:p-8">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
            <SearchBox onSelect={handleSelect} autoFocus placeholder="Search a book title, for example Harry Potter..." />
            <button
              type="button"
              onClick={handleRecommend}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-cyan-400 px-6 py-4 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              <WandSparkles size={18} /> Recommend Books
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}
        </div>

        {selectedBook && (
          <div className="mt-10">
            <SectionHeader eyebrow="Selected book" title="Your starting point" />
            <div className="max-w-sm">
              <BookCard book={selectedBook} />
            </div>
          </div>
        )}

        <div className="mt-12">
          <SectionHeader
            eyebrow="Recommendations"
            title="Books you may enjoy next"
            description="A higher match score means the book is more closely related to your selected title."
          />
          {loading && <Loader message="Finding books for you..." />}
          {!loading && recommendedBooks.length > 0 && <BookGrid books={recommendedBooks} showScore />}
          {!loading && recommendedBooks.length === 0 && !selectedBook && (
            <EmptyState
              title="Search a book to begin"
              message="Try a title like Harry Potter, The Hobbit, or The Da Vinci Code. Then select a result and click Recommend Books."
            />
          )}
          {!loading && selectedBook && recommendedBooks.length === 0 && !error && (
            <EmptyState
              icon={BookOpen}
              title="Ready when you are"
              message="Click Recommend Books to discover similar reads."
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default Recommend;
