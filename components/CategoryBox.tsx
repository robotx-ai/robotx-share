"use client";

import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import React, { useCallback } from "react";
import { IconType } from "react-icons";

type Props = {
  icon: IconType;
  label: string;
  selected?: boolean;
};

function CategoryBox({ icon: Icon, label, selected }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      category: label,
    };

    if (params?.get("category") === label) {
      delete updatedQuery.category;
    }

    const url = qs.stringifyUrl(
      {
        url: "/services",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [label, params, router]);

  return (
    <div
      onClick={handleClick}
      className={`flex flex-row items-center gap-2 px-5 py-2 rounded-full border-[1.5px] font-semibold text-sm transition cursor-pointer whitespace-nowrap ${
        selected
          ? "bg-neutral-900 border-neutral-900 text-white"
          : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800"
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </div>
  );
}

export default CategoryBox;
