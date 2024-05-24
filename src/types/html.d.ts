// types/html.d.ts
import React from 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends React.DOMAttributes<T> {
    '--i'?: string | number;
  }
}
