import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Movies, Series, Documentaries, SearchResults, Details } from './pages';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<Series />} />
        <Route path="/documentaries" element={<Documentaries />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/details" element={<Details />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
