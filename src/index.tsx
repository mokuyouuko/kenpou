import React from 'react';
import ReactDOM from 'react-dom/client';
import KenpoTypingWanakana from './KenpoTypingWanakana';

// React 18 以降の書き方
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <KenpoTypingWanakana />
  </React.StrictMode>
);
