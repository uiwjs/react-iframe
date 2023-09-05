import React from 'react';

let doc;
let win;
if (typeof document !== 'undefined') {
  doc = document;
}
if (typeof window !== 'undefined') {
  win = window;
}

export const FrameContext = React.createContext<ContextProps>({ document: doc, window: win });

interface ContextProps {
  document?: Document | null;
  window?: Window | null;
}

export const useFrame = () => React.useContext<ContextProps>(FrameContext);
