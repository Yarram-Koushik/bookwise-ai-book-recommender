import { Code2, Database, GitBranch, Rocket, Server, Sigma } from 'lucide-react';
import SectionHeader from '../components/SectionHeader.jsx';

const stack = [
  { icon: Code2, title: 'Frontend', description: 'React.js, JavaScript, Tailwind CSS, Axios, React Router, Lucide Icons' },
  { icon: Server, title: 'Backend', description: 'Python FastAPI REST API serving model predictions and book data' },
  { icon: Sigma, title: 'Machine Learning', description: 'Pandas, NumPy, Scikit-learn, cosine similarity, book-user matrix' },
  { icon: Database, title: 'Dataset', description: 'Books, users, and ratings CSV files cleaned and converted into model artifacts' },
  { icon: GitBranch, title: 'Version Control', description: 'GitHub repository with organized folders, README, screenshots, and setup steps' },
  { icon: Rocket, title: 'Deployment', description: 'Frontend on Vercel and backend on Render for a complete live project' },
];

function About() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Project overview"
          title="How BookWise AI works"
          description="This project is designed as a proper portfolio-level full-stack ML application, not just a basic notebook or UI demo."
        />

        <div className="glass-card rounded-[2rem] p-6 sm:p-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {stack.map((item) => (
              <div key={item.title} className="rounded-3xl bg-white/5 p-5">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                  <item.icon size={22} />
                </div>
                <h3 className="mt-4 text-xl font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="glass-card rounded-[2rem] p-6 sm:p-8">
            <h3 className="text-2xl font-black text-white">ML approach</h3>
            <p className="mt-4 leading-7 text-slate-400">
              The model creates a book-user pivot table where each row represents a book and each column represents a user. Ratings become the values. Then cosine similarity compares book vectors and finds titles with similar rating behavior.
            </p>
            <div className="mt-5 rounded-3xl bg-slate-950/70 p-5 text-sm text-slate-300">
              Input book → Match title → Find row in pivot table → Compare similarity scores → Return top recommended books
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6 sm:p-8">
            <h3 className="text-2xl font-black text-white">Why this is resume-ready</h3>
            <p className="mt-4 leading-7 text-slate-400">
              It has a Python ML pipeline, saved model artifacts, real REST APIs, modern frontend, API integration, responsive UI, GitHub documentation, and deployment plan. That makes it stronger than a simple Streamlit-only project.
            </p>
            <div className="mt-5 rounded-3xl bg-cyan-400/10 p-5 text-sm font-semibold text-cyan-100">
              Final stack: Python + FastAPI + Scikit-learn + React.js + JavaScript + Tailwind CSS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
