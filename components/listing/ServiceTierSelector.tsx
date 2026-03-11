"use client";

import React from "react";

export type Tier = {
  id: string;
  label: string;
  multiplier: number | null;
  desc: string;
};

export const TIERS: Tier[] = [
  {
    id: "silver",
    label: "Silver",
    multiplier: 1.0,
    desc: "5-day advance consulting · simple performance",
  },
  {
    id: "gold",
    label: "Gold",
    multiplier: 1.5,
    desc: "20-day consulting · custom choreography",
  },
  {
    id: "premium",
    label: "Premium Gold",
    multiplier: 2.5,
    desc: "1-month on-site · custom outfits · 2 rehearsals",
  },
  {
    id: "super",
    label: "Super Premium",
    multiplier: null,
    desc: "Human-robot co-stage · 3 rehearsals",
  },
];

const TIER_DOT_CLASSES: Record<string, string> = {
  silver: "bg-gray-400",
  gold: "bg-gray-500",
  premium: "bg-gray-700",
  super: "bg-gray-900",
};

type Props = {
  basePrice: number;
  selectedTierId: string;
  onSelect: (tierId: string) => void;
};

function ServiceTierSelector({ basePrice, selectedTierId, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Service package
      </p>
      {TIERS.map((tier) => {
        const isSelected = tier.id === selectedTierId;
        const tierPrice =
          tier.multiplier !== null
            ? Math.round(basePrice * tier.multiplier)
            : null;

        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => onSelect(tier.id)}
            className={`
              w-full text-left border rounded-lg px-3 py-3 transition-all
              ${
                isSelected
                  ? "border-neutral-900 bg-neutral-50"
                  : "border-neutral-200 hover:border-neutral-400"
              }
            `}
          >
            <div className="flex items-center gap-2">
              <span
                className={`
                  w-2.5 h-2.5 rounded-full flex-shrink-0
                  ${TIER_DOT_CLASSES[tier.id]}
                `}
              />
              <span className="flex-1 text-sm font-semibold">{tier.label}</span>
              {tierPrice !== null ? (
                <span className="text-sm font-bold">${tierPrice} / day</span>
              ) : (
                <span className="text-xs text-neutral-400 italic">
                  Contact for quote
                </span>
              )}
            </div>
            <p className="mt-1 pl-[18px] text-xs text-neutral-400">
              {tier.desc}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default ServiceTierSelector;
