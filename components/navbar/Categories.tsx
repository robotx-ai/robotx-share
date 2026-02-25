"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  FaRobot,
  FaWarehouse,
  FaUtensils,
} from "react-icons/fa";
import { MdOutlineCleaningServices } from "react-icons/md";
import CategoryBox from "../CategoryBox";
import Container from "../Container";

export const categories = [
  {
    label: "Showcase & Performance",
    icon: FaRobot,
    description: "Robots for demos, events, and live performance experiences.",
  },
  {
    label: "Cleaning",
    icon: MdOutlineCleaningServices,
    description: "Autonomous and operator-assisted cleaning service packages.",
  },
  {
    label: "Warehouse",
    icon: FaWarehouse,
    description: "Automation support for warehouse operations and workflows.",
  },
  {
    label: "Restaurant",
    icon: FaUtensils,
    description: "Service robots for restaurant operations and customer service.",
  },
];

type Props = {};

function Categories({}: Props) {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();

  const isMainPage = pathname === "/";

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
        {categories.map((items) => (
          <CategoryBox
            key={items.label}
            icon={items.icon}
            label={items.label}
            selected={category === items.label}
          />
        ))}
      </div>
    </Container>
  );
}

export default Categories;
