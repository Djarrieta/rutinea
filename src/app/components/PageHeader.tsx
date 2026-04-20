import Link from "next/link";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  emptyText: string;
  createHref: string;
  createLabel: string;
  isEmpty: boolean;
  children: ReactNode;
}

export default function PageHeader({
  title,
  emptyText,
  createHref,
  createLabel,
  isEmpty,
  children,
}: PageHeaderProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <Link
          href={createHref}
          className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          {createLabel}
        </Link>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-dashed border-border/60 bg-surface/30 backdrop-blur-sm text-center">
          <div className="w-16 h-16 mb-5 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-text-muted text-lg mb-6">{emptyText}</p>
          <Link
            href={createHref}
            className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 shadow-md inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            {createLabel}
          </Link>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
