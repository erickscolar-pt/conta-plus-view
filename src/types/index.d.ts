// index.d.ts

import { HTMLAttributes } from "react";

declare module "react" {
  interface CSSProperties {
    "--i"?: number;
  }
}
