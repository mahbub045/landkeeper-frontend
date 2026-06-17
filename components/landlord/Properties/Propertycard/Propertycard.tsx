"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types/landlord/Properties/PropertyTypes";
import { Bath, Bed, Home, MapPin } from "lucide-react";
import Image from "next/image";
import StatusBadge from "../Statusbadge/Statusbadge";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="cursor-pointer overflow-hidden rounded-2xl border border-gray-100 pt-0 pb-3 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700/50">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={property.image}
          alt={property.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute top-3 right-3">
          <StatusBadge status={property.status} />
        </div>
      </div>

      {/* Info */}
      <CardContent className="">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          {property.name}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="size-3 shrink-0 text-blue-500" />
          {property.address}
        </p>

        {/* Stats row */}
        <div className="mt-1 flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Bed className="size-3.5 text-blue-500" />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="size-3.5 text-blue-500" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Home className="size-3.5 text-blue-500" />
            {property.type}
          </span>
        </div>

        {/* Rent */}
        <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
          {property.rentPerMonth
            ? `£${property.rentPerMonth.toLocaleString()}/mo`
            : "Vacant"}
        </p>
      </CardContent>
    </Card>
  );
}
