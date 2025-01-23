import React from 'react';

export const Signature = () => {
  return (
    <div className="fixed bottom-4 right-4 font-cursive text-sm text-white/80 z-50">
      <span>Love, </span>
      <a
        href="https://justincurtsinger.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-white transition-colors duration-300 hover:animate-glow inline-block"
      >
        Justin
      </a>
    </div>
  );
};