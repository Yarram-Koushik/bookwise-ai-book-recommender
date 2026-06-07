import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { searchBooks } from '../api/bookApi.js';
import { normalizeImageUrl } from '../utils/bookUtils.js';

function SearchBox({ onSelect, placeholder = 'Search a book title...', autoFocus = false }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return undefined;
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchBooks(query.trim(), 8);
        setResults(data.results || []);
        setIsOpen(true);
      } catch (error) {
        console.error(error);
        setResults([]);
        setIsOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  const handleSelect = (book) => {
    setQuery(book.title);
    setIsOpen(false);
    onSelect?.(book);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    onSelect?.(null);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/10 px-4 py-3 shadow-2xl shadow-slate-950/20 backdrop-blur-xl focus-within:border-cyan-300/60">
        <Search className="shrink-0 text-cyan-300" size={22} />
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-base font-medium text-white placeholder:text-slate-500 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-30 max-h-96 overflow-auto rounded-3xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-slate-950/60 backdrop-blur-2xl">
          {loading && <p className="px-4 py-4 text-sm text-slate-400">Searching books...</p>}

          {!loading && results.length === 0 && (
            <p className="px-4 py-4 text-sm text-slate-400">No matching books found. Try another title.</p>
          )}

          {!loading &&
            results.map((book) => {
              const imageUrl = normalizeImageUrl(book.image_url);
              return (
                <button
                  key={`${book.title}-${book.author}`}
                  type="button"
                  onClick={() => handleSelect(book)}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-white/10"
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="h-16 w-11 rounded-lg object-cover" loading="lazy" />
                  ) : (
                    <div className="h-16 w-11 rounded-lg bg-white/10" />
                  )}
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-sm font-bold text-white">{book.title}</span>
                    <span className="mt-1 block truncate text-xs text-slate-400">{book.author || 'Unknown author'}</span>
                  </span>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default SearchBox;
