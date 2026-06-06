import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Brain, Database, Sparkles, Star, Users } from 'lucide-react';
import { getPopularBooks, getStats } from '../api/bookApi.js';
import BookGrid from '../components/BookGrid.jsx';
import Loader from '../components/Loader.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import { formatNumber, formatRating } from '../utils/bookUtils.js';

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
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
              <Sparkles size={16} /> AI-powered recommendations from reader-rating patterns
            </div>
            <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              Find your next favorite book with{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                BookWise AI.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A personalized book predictor built using Python, FastAPI, React, Tailwind CSS, and cosine similarity on user-rating data.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/recommend"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-6 py-4 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-300"
              >
                Get Recommendations <ArrowRight size={18} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-sm font-bold text-white hover:bg-white/15"
              >
                View ML Approach
              </Link>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-5 lg:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/5 p-5">
                <Brain className="text-cyan-300" size={34} />
                <h3 className="mt-4 text-xl font-black text-white">Collaborative Filtering</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Learns similarity from how users rated books and recommends titles with similar reading behavior.
                </p>
              </div>
              <div className="rounded-3xl bg-white/5 p-5">
                <Database className="text-indigo-300" size={34} />
                <h3 className="mt-4 text-xl font-black text-white">Book Dataset</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Uses processed book metadata, rating counts, average ratings, and similarity scores.
                </p>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-cyan-400 to-indigo-400 p-5 text-slate-950 sm:col-span-2">
                <p className="text-sm font-black uppercase tracking-[0.2em]">Live ML API</p>
                <h3 className="mt-3 text-3xl font-black">Search → Select → Recommend</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
                  Frontend sends the selected title to FastAPI, and the Python model returns similar books in real time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard icon={Database} label="Books in Model" value={formatNumber(stats?.total_books_in_model)} />
            <StatCard icon={Star} label="Average Rating" value={formatRating(stats?.average_rating)} />
            <StatCard icon={Users} label="Popular Books" value={formatNumber(stats?.total_popular_books)} />
            <StatCard icon={BarChart3} label="Most Rated" value={stats?.most_rated_book || 'Loading...'} />
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Popular picks"
            title="Books readers already love"
            description="A quick view of popular books based on rating count and average rating from the processed dataset."
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
