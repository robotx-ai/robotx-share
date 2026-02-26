"use client";

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
  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
            <Search />
            <div className="flex items-center gap-3">
              <a
                href="https://robotxshop.com"
                target="_blank"
                rel="noreferrer"
                className="hidden md:block text-sm font-semibold py-2 px-4 rounded-full border border-black hover:bg-neutral-100 transition"
              >
                RobotX Store
              </a>
              <UserMenu currentUser={currentUser} isAdmin={isAdmin} />
            </div>
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
}

export default Navbar;
