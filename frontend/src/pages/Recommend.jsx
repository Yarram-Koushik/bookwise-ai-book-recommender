import { useState } from 'react';
import { WandSparkles } from 'lucide-react';
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
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Recommendation engine"
          title="Search a book and get similar recommendations"
          description="Select a real book from the trained model. The backend will use cosine similarity to find books with similar reader-rating behavior."
        />

        <div className="glass-card rounded-[2rem] p-5 sm:p-8">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
            <SearchBox onSelect={handleSelect} autoFocus />
            <button
              type="button"
              onClick={handleRecommend}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-cyan-400 px-6 py-4 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
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
            <SectionHeader eyebrow="Selected book" title="Your selected book" />
            <div className="max-w-sm">
              <BookCard book={selectedBook} />
            </div>
          </div>
        )}

        <div className="mt-12">
          <SectionHeader
            eyebrow="AI results"
            title="Recommended for you"
            description="Higher match score means stronger similarity according to the trained book-user rating matrix."
          />
          {loading && <Loader message="Generating recommendations..." />}
          {!loading && recommendedBooks.length > 0 && <BookGrid books={recommendedBooks} showScore />}
          {!loading && recommendedBooks.length === 0 && !selectedBook && (
            <EmptyState title="Start by searching a book" message="Search for a title like Harry Potter, The Hobbit, or The Da Vinci Code, then click Recommend Books." />
          )}
          {!loading && selectedBook && recommendedBooks.length === 0 && !error && (
            <EmptyState title="Ready to recommend" message="Click the Recommend Books button to generate similar books." />
          )}
        </div>
      </div>
    </section>
  );
}

export default Recommend;
