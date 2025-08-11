import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { WatchPage } from './pages/WatchPage';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-[#0f172a] min-h-screen text-white font-sans">
        <Header />
        <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/watch" element={<WatchPage />} />
        </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
