import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimeVideoLogo, SearchIcon } from './Icons';

export const Header = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-[#0f172a] to-transparent z-50 flex items-center justify-between px-4 md:px-10 py-4">
      <div className="flex items-center space-x-8">
        <button onClick={handleGoHome} className="cursor-pointer">
          <PrimeVideoLogo />
        </button>
        <nav className="hidden md:flex items-center space-x-6 text-gray-300">
          <button onClick={handleGoHome} className="font-semibold text-white">Home</button>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <SearchIcon />
        <img src="https://placehold.co/40x40/FFFFFF/0f172a?text=U" alt="User Avatar" className="w-8 h-8 rounded-full" />
      </div>
    </header>
  );
};
