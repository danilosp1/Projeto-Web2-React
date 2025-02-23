import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const debounce = (func: Function, delay: number) => {
    let timer: any;
    return (...args: any[]) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(query)}`);
    }
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <header className="header">
      <nav>
        <div className="nav-inner">
          <div className="logo-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="/">
              <img src={logo} alt="Logo" className="logo" />
            </a>
            <ul className="nav-list">
              <li><a href="/">Início</a></li>
              <li><a href="/movies">Filmes</a></li>
              <li><a href="/series">Séries</a></li>
              <li><a href="/documentaries">Documentários</a></li>
            </ul>
          </div>
          <div className="search-box">
            <span className="material-icons" id="search-icon">search</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={onChange}
              placeholder="Buscar"
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
