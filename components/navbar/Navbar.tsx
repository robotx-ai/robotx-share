"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SafeUser } from "@/types";
import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import Categories from "./Categories";

type Props = {
  currentUser?: SafeUser | null;
  isAdmin?: boolean;
};

function Navbar({ currentUser, isAdmin = false }: Props) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <div
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className={`py-4 transition-all duration-300 ${scrolled ? "border-b-[1px]" : ""}`}>
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo transparent={transparent} />
            <Search transparent={transparent} />
            <div className="flex items-center gap-3">
              <a
                href="https://robotxshop.com"
                target="_blank"
                rel="noreferrer"
                className={`hidden md:block text-sm font-semibold py-2 px-4 rounded-full border transition ${
                  transparent
                    ? "border-white/70 text-white hover:bg-white/10"
                    : "border-black hover:bg-neutral-100"
                }`}
              >
                RobotX Store
              </a>
              <UserMenu currentUser={currentUser} isAdmin={isAdmin} transparent={transparent} />
            </div>
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
}

export default Navbar;
