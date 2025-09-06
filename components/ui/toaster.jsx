import React from 'react';
import { createPortal } from 'react-dom';

const Toaster = () => {
  return createPortal(
    <div id="toaster-root" className="fixed top-4 right-4 z-50">
      {/* Toast notifications will be rendered here */}
    </div>,
    document.body
  );
};

export { Toaster };
