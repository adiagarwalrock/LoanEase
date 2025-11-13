import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center justify-center size-8 bg-primary rounded-lg text-primary-foreground">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
        >
            <path d="M4 4h16v16H4z" />
            <path d="M9 9h6v6H9z" />
            <path d="M9 15v3" />
            <path d="M15 15v3" />
            <path d="M9 6V3" />
            <path d="M15 6V3" />
        </svg>
    </div>
  );
}
