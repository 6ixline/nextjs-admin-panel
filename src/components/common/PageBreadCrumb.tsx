'use client';
import Link from "next/link";
import React from "react";

interface BreadcrumbProps {
  pageTitle: string;
  showNewButton: boolean;
  link?: string;
  additionalButtons?: React.ReactNode;
  showBackButton?: boolean;
  backLink?: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ 
  pageTitle, 
  showNewButton, 
  link, 
  additionalButtons,
  showBackButton = false,
  backLink
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex flex-column gap-4 items-center">
        {showBackButton && backLink && (
          <Link
            href={backLink}
            className="inline-flex items-center gap-1.5 rounded-sm bg-gray-500 px-3 py-[5px] text-xs text-white disabled:opacity-50 hover:bg-gray-600 transition"
          >
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </Link>
        )}
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          {pageTitle}
        </h2>
        <div className="flex gap-2 items-center">
          
          {showNewButton && link && (
            <Link
              href={link}
              className="rounded-sm bg-[#0951a0] px-3 py-[5px] text-xs text-white disabled:opacity-50 hover:bg-[rgb(50,70,200)] transition"
            >
              Add New
            </Link>
          )}
          {additionalButtons}
        </div>
      </div>
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              href="/"
            >
              Home
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
          <li className="text-sm text-gray-800 dark:text-white/90">
            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;