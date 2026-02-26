"use client";

import useLoginModel from "@/hook/useLoginModal";
import useRegisterModal from "@/hook/useRegisterModal";
import useRentModal from "@/hook/useRentModal";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { SafeUser } from "@/types";
import { signOut } from "next-auth/react";
import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";

type Props = {
  currentUser?: SafeUser | null;
  isAdmin?: boolean;
};

function UserMenu({ currentUser, isAdmin = false }: Props) {
  const router = useRouter();
  const registerModel = useRegisterModal();
  const loginModel = useLoginModel();
  const rentModel = useRentModal();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModel.onOpen();
    }

    if (!isAdmin) {
      return;
    }

    rentModel.onOpen();
  }, [currentUser, isAdmin, loginModel, rentModel]);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        {isAdmin && (
          <div
            className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
            onClick={onRent}
          >
            List a Service
          </div>
        )}
        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px] flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            {currentUser ? (
              <Avatar src={currentUser?.image!} userName={currentUser?.name} />
            ) : (
              <Image
                className="rounded-full"
                height="30"
                width="30"
                alt="Avatar"
                src="/assets/avatar.png"
              />
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem
                  onClick={() => router.push("/trips")}
                  label="My scheduled services"
                />
                <MenuItem
                  onClick={() => router.push("/favorites")}
                  label="Saved services"
                />
                <MenuItem
                  onClick={() => router.push("/reservations")}
                  label="Service bookings"
                />
                {isAdmin && (
                  <MenuItem
                    onClick={() => router.push("/properties")}
                    label="My services"
                  />
                )}
                {isAdmin && <MenuItem onClick={onRent} label="List a service" />}
                <MenuItem
                  onClick={() => window.open("https://robotxshop.com", "_blank")}
                  label="Visit robotxshop.com"
                />
                <hr />
                <MenuItem onClick={() => signOut()} label="Logout" />
              </>
            ) : (
              <>
                <MenuItem
                  onClick={() => window.open("https://robotxshop.com", "_blank")}
                  label="Visit robotxshop.com"
                />
                <MenuItem onClick={loginModel.onOpen} label="Login" />
                <MenuItem onClick={registerModel.onOpen} label="Sign up" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
