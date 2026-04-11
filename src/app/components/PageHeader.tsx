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
  if (isEmpty) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <p className="text-gray-500">
          {emptyText}{" "}
          <Link href={createHref} className="text-blue-600 underline">
            {createLabel}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">{children}</div>
    </div>
  );
}
