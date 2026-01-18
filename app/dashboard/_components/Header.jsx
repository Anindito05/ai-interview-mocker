"use client";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

const Header = () => {
  const path = usePathname();
  return (
    <div className="flex p-2 items-center justify-between bg-secondary shadow-sm">
      <Image
        src={"/ai-removebg-preview.svg"}
        width={80}
        height={50}
        alt="logo"
      />
      <UserButton />
    </div>
  );
};

export default Header;
