"use client";

import {
  DocCategory,
  PropertyDocument,
} from "@/types/landlord/Documents/DocumentTypes";
import { Download, FileImage, FileText, Share2, Trash2 } from "lucide-react";

function DocIcon({ category }: { category: DocCategory }) {
  const isPhoto = category === "photo";
  return (
    <div
      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
        isPhoto
          ? "bg-emerald-100 dark:bg-emerald-900/30"
          : "bg-red-100 dark:bg-red-900/30"
      }`}
    >
      {isPhoto ? (
        <FileImage className="size-5 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <FileText className="size-5 text-red-500 dark:text-red-400" />
      )}
    </div>
  );
}

interface DocumentListProps {
  documents: PropertyDocument[];
  activeFilter: string;
}

export default function DocumentList({
  documents,
  activeFilter,
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileText className="mb-3 size-10 text-gray-300 dark:text-gray-600" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          No documents found for &quot;{activeFilter}&quot;
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 divide-y divide-gray-50 p-4 dark:divide-gray-700/30">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 transition-shadow hover:shadow-sm dark:border-gray-700/50 dark:bg-gray-800/50"
        >
          <DocIcon category={doc.category} />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {doc.name}
            </p>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
              {doc.property} &bull; {doc.category} &bull; {doc.sizeMB} MB
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              aria-label="Download"
              className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <Download className="size-3.5" />
            </button>
            <button
              aria-label="Share"
              className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <Share2 className="size-3.5" />
            </button>
            <button
              aria-label="Delete"
              className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-gray-600 dark:text-gray-400 dark:hover:border-red-800 dark:hover:bg-red-900/20"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
