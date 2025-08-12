import type { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
}

export const Button = ({children}: ButtonProps): ReactNode => {
  return (
    <button className="uglyworkgood-button">
      {children}
    </button>
  );
}