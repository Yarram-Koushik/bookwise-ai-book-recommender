import { useEffect, useState } from 'react';
import { getPopularBooks } from '../api/bookApi.js';
import BookGrid from '../components/BookGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loader from '../components/Loader.jsx';
import SectionHeader from '../components/SectionHeader.jsx';

function Popular() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPopularBooks = async () => {
      try {
        const data = await getPopularBooks(40);
        setBooks(data.books || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPopularBooks();
  }, []);

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Popular books"
          title="Browse books readers are talking about"
          description="A curated collection of highly active books from the library, based on rating activity and reader interest."
        />
        {loading && <Loader message="Loading popular books..." />}
        {!loading && books.length > 0 && <BookGrid books={books} />}
        {!loading && books.length === 0 && (
          <EmptyState title="No popular books found" message="Please refresh the page or try again later." />
        )}
      </div>
    </section>
  );
}

export default Popular;
