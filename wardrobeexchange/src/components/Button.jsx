import React from "react";

export default function Button({ path, className, text, children, emoji }) {
  return (
    <a
      href={path}
      className={`btn-hover flex items-center justify-center transition-transform duration-200 hover:-translate-y-1 ${className}`}
    >
      {text}
      <span>{emoji}</span>
      {children}
    </a>
  );
}
