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
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Popular books"
          title="Top books from the dataset"
          description="These books are ranked using popularity signals such as number of ratings and average rating."
        />
        {loading && <Loader />}
        {!loading && books.length > 0 && <BookGrid books={books} />}
        {!loading && books.length === 0 && <EmptyState />}
      </div>
    </section>
  );
}

export default Popular;
