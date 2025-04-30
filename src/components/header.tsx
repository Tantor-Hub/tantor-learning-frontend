"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/trainings", label: "Formation" },
  { href: "/trainings", label: "Bibliothèque" },
  { href: "#", label: "Candidater" },
  { href: "/about-us", label: "À propos" },
];

const NavLinks = ({ className }: { className?: string }) => (
  <nav className={className}>
    {navLinks.map(({ href, label }) => (
      <Link href={href} key={label} className="p-2 text-nowrap hover:text-shadow-sm">
        {label}
      </Link>
    ))}
  </nav>
);

const AuthButtons = ({
  direction = "row",
  signin,
  signup,
}: {
  direction?: "row" | "col";
  signin: () => void;
  signup: () => void;
}) => {
  const baseStyle =
    "px-3.5 py-6 rounded-[12px] border border-[#0353A4] text-[16px] lg:text-xl cursor-pointer";
  const spacing = direction === "row" ? "flex gap-2 xl:gap-4" : "flex flex-col gap-4";

  return (
    <div className={spacing}>
      <Button className={`${baseStyle} bg-white text-[#0353A4]`} onClick={signup}>
        S'inscrire
      </Button>
      <Button className={`${baseStyle} bg-[#0353A4] text-white`} onClick={signin}>
        Se connecter
      </Button>
    </div>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="text-[#0353A4] font-medium text-base lg:text-[22px] sticky top-0 z-30 backdrop-blur-xl bg-[#FFFFFFCC]">
      <div className="max-w-[1440px] flex justify-between lg:justify-start md:gap-[5%] xl:gap-[10%] items-center m-auto py-4 lg:py-6 px-5 md:px-10">
        <Link href="/" className="flex gap-1 lg:gap-4 items-center ">
          <Image
            src="/tantor-logo.svg"
            height={48}
            width={48}
            alt="Tantor logo"
            className="h-8 w-auto lg:w-12"
          />
          <h1 className="text-nowrap border-b-2 border-red-500">Tantor Learning</h1>
        </Link>

        <div className="hidden lg:flex lg:flex-[1] justify-between items-center gap-2 xl:gap-6">
          <NavLinks className="flex xl:gap-2.5" />
          <AuthButtons
            signin={() => router.push("/signin")}
            signup={() => router.push("/signup")}
          />
        </div>

        <button
          className="lg:hidden text-gray-700"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white pb-5 shadow-md border-t absolute z-50 w-full left-0 px-5">
          <NavLinks className="flex flex-col items-center py-4 space-y-4" />
          <AuthButtons
            direction="col"
            signin={() => router.push("/signin")}
            signup={() => router.push("/signup")}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
