import { BookOpen, Brain, Cloud, Code2, Database, GitBranch, Layers, Rocket, Server, Sparkles } from 'lucide-react';
import SectionHeader from '../components/SectionHeader.jsx';

const overviewCards = [
  {
    icon: BookOpen,
    title: 'Book discovery',
    description: 'Users can search for a book they know and instantly discover similar titles.',
  },
  {
    icon: Sparkles,
    title: 'Personalized suggestions',
    description: 'Recommendations are based on reading and rating patterns from the dataset.',
  },
  {
    icon: Cloud,
    title: 'Live experience',
    description: 'The app is deployed online with a separate frontend and backend.',
  },
];

const stack = [
  { icon: Code2, title: 'Frontend', description: 'React.js, JavaScript, Tailwind CSS, Axios, React Router, and Lucide Icons.' },
  { icon: Server, title: 'Backend', description: 'Python FastAPI service that provides book search, popular books, details, and recommendations.' },
  { icon: Brain, title: 'Machine Learning', description: 'Collaborative filtering using Pandas, NumPy, Scikit-learn, and cosine similarity.' },
  { icon: Database, title: 'Dataset', description: 'Books, users, and ratings data are cleaned and converted into reusable model files.' },
  { icon: GitBranch, title: 'Version Control', description: 'Organized GitHub repository with frontend, backend, model files, screenshots, and documentation.' },
  { icon: Rocket, title: 'Deployment', description: 'Frontend is deployed on Vercel and backend is deployed on Render.' },
];

function About() {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="About BookWise AI"
          title="A smarter way to discover similar books"
          description="BookWise AI combines a clean reader-friendly interface with a machine learning recommendation system behind the scenes."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {overviewCards.map((item) => (
            <div key={item.title} className="glass-card rounded-[2rem] p-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                <item.icon size={22} />
              </div>
              <h3 className="mt-5 text-xl font-black text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-card rounded-[2rem] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-400/15 text-indigo-300">
                <Layers size={22} />
              </div>
              <h3 className="text-2xl font-black text-white">How recommendations are created</h3>
            </div>

            <p className="mt-5 leading-7 text-slate-400">
              The system compares books using rating behavior. If many readers rate two books in a similar pattern, those books become stronger matches for each other.
            </p>

            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">Simple flow</p>
              <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-300">
                <span>1. Search and select a book</span>
                <span>2. Find the selected book in the recommendation model</span>
                <span>3. Compare it with similar book patterns</span>
                <span>4. Return the closest matching books</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6 sm:p-8">
            <h3 className="text-2xl font-black text-white">Technology used</h3>
            <p className="mt-3 leading-7 text-slate-400">
              Technical details are kept here so the main app stays simple and reader-focused.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {stack.map((item) => (
                <div key={item.title} className="rounded-3xl bg-white/[0.04] p-5">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                    <item.icon size={20} />
                  </div>
                  <h4 className="mt-4 text-lg font-black text-white">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6 sm:p-8">
          <h3 className="text-2xl font-black text-white">Project highlights</h3>
          <p className="mt-3 max-w-4xl leading-7 text-cyan-50/90">
            BookWise AI includes a complete recommendation workflow, saved model files, API integration, responsive frontend pages, GitHub documentation, and live deployment.
          </p>
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
            Final stack: Python + FastAPI + Scikit-learn + React.js + JavaScript + Tailwind CSS
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
