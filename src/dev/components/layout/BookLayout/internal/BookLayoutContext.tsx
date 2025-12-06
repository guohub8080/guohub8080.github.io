/** @jsxImportSource react */
import React from "react";

export interface BookLayoutConfig {
  basePrefix?: string;
}

const BookLayoutConfigContext = React.createContext<BookLayoutConfig>({});

export const BookLayoutConfigProvider: React.FC<React.PropsWithChildren<BookLayoutConfig>> = ({ basePrefix, children }) => {
  const value = React.useMemo(() => ({ basePrefix }), [basePrefix]);
  return (
    <BookLayoutConfigContext.Provider value={value}>{children}</BookLayoutConfigContext.Provider>
  );
};

export function useBookLayoutConfig(): BookLayoutConfig {
  return React.useContext(BookLayoutConfigContext);
}


