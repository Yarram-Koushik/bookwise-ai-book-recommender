import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Recommend from './pages/Recommend.jsx';
import Popular from './pages/Popular.jsx';
import BookDetails from './pages/BookDetails.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="min-h-screen text-slate-100">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/book" element={<BookDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
