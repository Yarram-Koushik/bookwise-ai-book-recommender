import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Building2, Calendar, Star, Users } from 'lucide-react';
import { getBookDetails, recommendBooks } from '../api/bookApi.js';
import BookGrid from '../components/BookGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loader from '../components/Loader.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { formatNumber, formatRating, normalizeImageUrl } from '../utils/bookUtils.js';

function BookDetails() {
  const [searchParams] = useSearchParams();
  const title = searchParams.get('title');
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      if (!title) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [bookData, recommendationData] = await Promise.all([
          getBookDetails(title),
          recommendBooks(title, 4),
        ]);
        setBook(bookData);
        setSimilarBooks(recommendationData.recommendations || []);
      } catch (error) {
        console.error(error);
        setBook(null);
        setSimilarBooks([]);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [title]);

  if (loading) {
    return (
      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <Loader message="Loading book details..." />
        </div>
      </section>
    );
  }

  if (!book) {
    return (
      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <EmptyState title="Book not found" message="This book is not available right now. Try searching another title." />
        </div>
      </section>
    );
  }

  const imageUrl = normalizeImageUrl(book.image_url);

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <Link to="/recommend" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-100">
          <ArrowLeft size={18} /> Back to recommendations
        </Link>

        <div className="glass-card grid gap-6 rounded-[2rem] p-5 sm:p-8 lg:grid-cols-[340px_1fr] lg:gap-8">
          <div className="overflow-hidden rounded-3xl bg-slate-900">
            {imageUrl ? (
              <img src={imageUrl} alt={book.title} className="h-96 w-full object-cover object-top sm:h-[30rem] lg:h-[32rem]" />
            ) : (
              <div className="grid h-96 place-items-center px-6 text-center text-slate-400 sm:h-[30rem] lg:h-[32rem]">Cover unavailable</div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">Book details</p>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">{book.title}</h1>
            <p className="mt-4 text-xl font-semibold text-slate-300">{book.author}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/5 p-5">
                <div className="mb-2 flex items-center gap-2 text-amber-300">
                  <Star size={18} /> Average Rating
                </div>
                <p className="text-3xl font-black text-white">{formatRating(book.avg_rating)}</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-5">
                <div className="mb-2 flex items-center gap-2 text-cyan-300">
                  <Users size={18} /> Reader Ratings
                </div>
                <p className="text-3xl font-black text-white">{formatNumber(book.num_ratings)}</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-5">
                <div className="mb-2 flex items-center gap-2 text-indigo-300">
                  <Calendar size={18} /> Published Year
                </div>
                <p className="text-3xl font-black text-white">{book.year || 'N/A'}</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-5">
                <div className="mb-2 flex items-center gap-2 text-violet-300">
                  <Building2 size={18} /> Publisher
                </div>
                <p className="text-lg font-bold text-white">{book.publisher || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <SectionHeader
            eyebrow="Similar reads"
            title="Readers may also like"
            description="Explore books that share similar reader interest with this title."
          />
          {similarBooks.length > 0 ? <BookGrid books={similarBooks} showScore /> : <EmptyState />}
        </div>
      </div>
    </section>
  );
}

export default BookDetails;
