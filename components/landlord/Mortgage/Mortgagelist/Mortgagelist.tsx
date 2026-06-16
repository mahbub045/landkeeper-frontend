"use client";

import { mortgages } from "@/data/landlord/mortgage/MortgageData";
import MortgageCard from "../Mortgagecard/Mortgagecard";

export default function MortgageList() {
  return (
    <div className="space-y-4">
      {mortgages.map((mortgage) => (
        <MortgageCard key={mortgage.id} mortgage={mortgage} />
      ))}
    </div>
  );
}
