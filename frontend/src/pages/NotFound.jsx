import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';

function NotFound() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <EmptyState title="Page not found" message="The page you are looking for does not exist." />
        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 hover:bg-cyan-300">
            Go Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
