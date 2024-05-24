// types/css.d.ts
declare namespace JSX {
    interface IntrinsicElements {
      [key: string]: any;
      style: React.CSSProperties & {
        '--i'?: string | number;
      };
    }
  }
  
  // types/css.d.ts
declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
  }
  