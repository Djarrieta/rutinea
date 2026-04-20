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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {!isEmpty && (
          <Link
            href={createHref}
            className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {createLabel}
          </Link>
        )}
      </div>

      {isEmpty ? (
        <p className="text-text-muted">
          {emptyText}{" "}
          <Link href={createHref} className="text-primary-600 hover:text-primary-500 underline transition-colors">
            {createLabel}
          </Link>
        </p>
      ) : (
        children
      )}
    </div>
  );
}
