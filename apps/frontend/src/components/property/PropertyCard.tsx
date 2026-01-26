'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType: string;
  imageUrl?: string;
  description?: string;
  slug?: string;
}

export function PropertyCard({
  id,
  title,
  price,
  location,
  area,
  bedrooms,
  bathrooms,
  propertyType,
  description,
  slug,
}: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorited(!isFavorited);
  };

  const propertyUrl = slug ? `/bat-dong-san/${slug}` : `/bat-dong-san/${id}`;

  return (
    <article className="group overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image Container */}
      <div className="relative aspect-property overflow-hidden bg-gradient-to-br from-primary to-primary-light">
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
          🏠
        </div>

        {/* Price Badge */}
        <div className="absolute left-3 top-3 rounded-md bg-danger px-3 py-1.5 shadow-lg">
          <span className="font-heading text-lg font-bold text-white">{price}</span>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
          aria-label={isFavorited ? 'Bỏ lưu tin' : 'Lưu tin'}
        >
          <svg
            className={`h-5 w-5 transition-colors ${
              isFavorited ? 'fill-danger stroke-danger' : 'fill-none stroke-gray-dark'
            }`}
            viewBox="0 0 24 24"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-md">
        {/* Property Type Badge */}
        <span className="inline-block rounded bg-primary-light/10 px-2 py-1 text-xs font-medium text-primary">
          {propertyType}
        </span>

        {/* Title */}
        <h3 className="mt-2 font-heading text-xl font-semibold leading-snug text-gray-dark line-clamp-2">
          <Link
            href={propertyUrl}
            className="transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {title}
          </Link>
        </h3>

        {/* Location */}
        <p className="mt-2 flex items-center text-sm text-gray-medium">
          <svg
            className="mr-1 h-4 w-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {location}
        </p>

        {/* Key Stats */}
        <div className="mt-3 flex items-center space-x-4 text-sm text-gray-dark">
          {bedrooms && (
            <span className="flex items-center" title="Phòng ngủ">
              <svg
                className="mr-1 h-4 w-4 text-primary-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {bedrooms}
            </span>
          )}
          {bathrooms && (
            <span className="flex items-center" title="Phòng tắm">
              <svg
                className="mr-1 h-4 w-4 text-primary-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                />
              </svg>
              {bathrooms}
            </span>
          )}
          <span className="flex items-center" title="Diện tích">
            <svg
              className="mr-1 h-4 w-4 text-primary-light"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
            {area}m²
          </span>
        </div>

        {/* Description */}
        {description && (
          <p className="mt-3 text-sm leading-relaxed text-gray-medium line-clamp-1">
            {description}
          </p>
        )}

        {/* Divider */}
        <div className="my-3 border-t border-gray-light"></div>

        {/* CTA Button */}
        <Link
          href={propertyUrl}
          className="block w-full rounded-md border-2 border-primary-light bg-transparent py-3 text-center text-base font-medium text-primary-light transition-all hover:bg-primary-light hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
        >
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
}
