import * as React from "react";

// react-icons v5 changed icon return types to ReactNode, which TypeScript 5
// rejects as a valid JSX element. These module overrides restore compatibility.

declare module "react-icons" {
  export type IconType = React.FC<{
    size?: number | string;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    title?: string;
  }>;
}

declare module "react-icons/ai" {
  const content: Record<string, React.FC<{ size?: number | string; color?: string; className?: string; style?: React.CSSProperties; title?: string }>>;
  export = content;
}
declare module "react-icons/bi" {
  const content: Record<string, React.FC<{ size?: number | string; color?: string; className?: string; style?: React.CSSProperties; title?: string }>>;
  export = content;
}
declare module "react-icons/fa" {
  const content: Record<string, React.FC<{ size?: number | string; color?: string; className?: string; style?: React.CSSProperties; title?: string }>>;
  export = content;
}
declare module "react-icons/fc" {
  const content: Record<string, React.FC<{ size?: number | string; color?: string; className?: string; style?: React.CSSProperties; title?: string }>>;
  export = content;
}
declare module "react-icons/io" {
  const content: Record<string, React.FC<{ size?: number | string; color?: string; className?: string; style?: React.CSSProperties; title?: string }>>;
  export = content;
}
declare module "react-icons/io5" {
  const content: Record<string, React.FC<{ size?: number | string; color?: string; className?: string; style?: React.CSSProperties; title?: string }>>;
  export = content;
}
declare module "react-icons/lu" {
  const content: Record<string, React.FC<{ size?: number | string; color?: string; className?: string; style?: React.CSSProperties; title?: string }>>;
  export = content;
}
declare module "react-icons/md" {
  const content: Record<string, React.FC<{ size?: number | string; color?: string; className?: string; style?: React.CSSProperties; title?: string }>>;
  export = content;
}
declare module "react-icons/tb" {
  const content: Record<string, React.FC<{ size?: number | string; color?: string; className?: string; style?: React.CSSProperties; title?: string }>>;
  export = content;
}
