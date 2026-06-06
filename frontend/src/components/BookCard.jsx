import { Link } from 'react-router-dom';
import { Star, Users, Sparkles } from 'lucide-react';
import { buildBookDetailsUrl, formatNumber, formatRating, normalizeImageUrl } from '../utils/bookUtils.js';

function BookCard({ book, showScore = false }) {
  const imageUrl = normalizeImageUrl(book?.image_url);

  return (
    <article className="group glass-card flex h-full flex-col overflow-hidden rounded-3xl p-4 hover:-translate-y-1 hover:border-cyan-300/40">
      <Link to={buildBookDetailsUrl(book.title)} className="block overflow-hidden rounded-2xl bg-slate-900">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={book.title}
            className="h-72 w-full object-cover object-top book-cover-shadow transition duration-300 group-hover:scale-105 sm:h-80"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="grid h-72 place-items-center bg-slate-900 px-4 text-center text-sm text-slate-400 sm:h-80">
            Cover unavailable
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <Link to={buildBookDetailsUrl(book.title)}>
          <h3 className="line-clamp-2 text-base font-bold leading-6 text-white group-hover:text-cyan-200">
            {book.title}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-1 text-sm text-slate-400">{book.author || 'Unknown author'}</p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div className="rounded-2xl bg-white/5 p-3">
            <div className="mb-1 flex items-center gap-1 text-amber-300">
              <Star size={14} /> Rating
            </div>
            <p className="font-bold text-white">{formatRating(book.avg_rating)}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-3">
            <div className="mb-1 flex items-center gap-1 text-cyan-300">
              <Users size={14} /> Ratings
            </div>
            <p className="font-bold text-white">{formatNumber(book.num_ratings)}</p>
          </div>
        </div>

        {showScore && book.similarity_score !== null && book.similarity_score !== undefined && (
          <div className="mt-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-xs text-cyan-100">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles size={14} /> Match Score: {Number(book.similarity_score).toFixed(3)}
            </div>
          </div>
        )}

        <Link
          to={buildBookDetailsUrl(book.title)}
          className="mt-4 inline-flex items-center justify-center rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-cyan-400 hover:text-slate-950"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default BookCard;
