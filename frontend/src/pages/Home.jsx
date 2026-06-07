import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Heart, Search, Sparkles, Star, TrendingUp, Users } from 'lucide-react';
import { getPopularBooks, getStats } from '../api/bookApi.js';
import BookGrid from '../components/BookGrid.jsx';
import Loader from '../components/Loader.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import { formatNumber, formatRating } from '../utils/bookUtils.js';

const steps = [
  {
    icon: Search,
    title: 'Search any book',
    description: 'Start with a title you already know or enjoyed reading.',
  },
  {
    icon: BookOpen,
    title: 'Pick the right match',
    description: 'Choose the exact book from the search suggestions.',
  },
  {
    icon: Sparkles,
    title: 'Discover similar reads',
    description: 'Get a clean list of books that match similar reader preferences.',
  },
];

function Home() {
  const [stats, setStats] = useState(null);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [statsData, popularData] = await Promise.all([getStats(), getPopularBooks(8)]);
        setStats(statsData);
        setPopularBooks(popularData.books || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden px-4 pt-10 pb-14 sm:px-6 sm:pt-12 sm:pb-16 lg:px-8 lg:pt-14 lg:pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
          <div className="absolute left-1/2 top-6 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-10 top-16 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start xl:gap-12">
          <div className="pt-0 lg:pt-4">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-cyan-100 shadow-lg shadow-slate-950/20 backdrop-blur-xl sm:text-sm">
              <Sparkles size={16} /> Smarter book discovery, made simple
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Find books that feel like your{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                next favorite read.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              BookWise AI helps you discover books similar to the ones you already like. Search a title, select the best match, and explore recommendations instantly.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/recommend"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-6 py-4 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 hover:bg-cyan-300"
              >
                Start Discovering <ArrowRight size={18} />
              </Link>
              <Link
                to="/popular"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-white/15"
              >
                Browse Popular Books
              </Link>
            </div>
          </div>

          <div className="glass-card rounded-[1.75rem] p-4 sm:rounded-[2rem] sm:p-5 lg:p-6">
            <div className="rounded-[1.35rem] border border-white/10 bg-slate-950/40 p-4 sm:rounded-[1.5rem] sm:p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300 sm:text-sm">How it works</p>

              <div className="mt-5 space-y-3 sm:space-y-4">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex gap-3 rounded-3xl bg-white/[0.04] p-4 sm:gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-300 sm:h-12 sm:w-12">
                      <step.icon size={21} />
                    </div>
                    <div>
                      <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-slate-500 sm:text-xs">Step {index + 1}</p>
                      <h3 className="mt-1 text-base font-black text-white sm:text-lg">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[1.35rem] bg-gradient-to-br from-cyan-300 via-sky-300 to-indigo-300 p-5 text-slate-950 sm:rounded-[1.5rem]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-700 sm:text-sm">Fast flow</p>
                  <h3 className="mt-2 text-2xl font-black sm:text-3xl">Search → Select → Discover</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
                    A smooth experience built for readers who want quick and relevant suggestions.
                  </p>
                </div>
                <Heart className="mt-1 hidden shrink-0 sm:block" size={34} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={BookOpen} label="Books Available" value={formatNumber(stats?.total_books_in_model)} />
            <StatCard icon={Star} label="Average Rating" value={formatRating(stats?.average_rating)} />
            <StatCard icon={Users} label="Popular Picks" value={formatNumber(stats?.total_popular_books)} />
            <StatCard icon={TrendingUp} label="Most Rated Book" value={stats?.most_rated_book || 'Loading...'} />
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Popular picks"
            title="Books readers already love"
            description="Explore a quick collection of well-known books with strong reader activity."
            action={
              <Link to="/popular" className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-cyan-400 hover:text-slate-950">
                See all popular books
              </Link>
            }
          />
          {loading ? <Loader /> : <BookGrid books={popularBooks} />}
        </div>
      </section>
    </div>
  );
}

export default Home;
