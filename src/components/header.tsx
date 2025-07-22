"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated } from "@/features/auth/auth-slice";
import { useLogout } from "@/hooks/use-logout";
import { RoleSelectionDialog, useRoleSelection } from "@/components/role-selection-dialog";

const publicLinks = [
  { href: "/trainings", label: "Formation" },
  { href: "/library", label: "Bibliothèque" },
  { href: "/about-us", label: "À propos" },
];

const privateLinks = [{ href: "#", label: "Tableau de bord" }, ...publicLinks];

interface NavLinksProps {
  className?: string;
  isAuthenticated: boolean;
  onDashboardClick?: () => void;
  isMobile?: boolean;
  closeMobileMenu?: () => void;
  currentPath: string;
}

const NavLinks = ({
  className,
  isAuthenticated,
  onDashboardClick,
  isMobile = false,
  closeMobileMenu,
  currentPath,
}: NavLinksProps) => (
  <nav
    className={`${isMobile ? "flex" : "hidden md:flex"} items-center ${isMobile ? "flex-col space-y-4 mt-4" : "space-x-8"} ${className}`}
  >
    {(isAuthenticated ? privateLinks : publicLinks).map(({ href, label }) => {
      const isActive = href === "#" ? false : currentPath === href;

      return href === "#" ? (
        <div
          key={label}
          onClick={() => {
            onDashboardClick?.();
            closeMobileMenu?.();
          }}
          className="text-foreground hover:text-primary font-normal flex items-center hover:cursor-pointer whitespace-nowrap"
        >
          {label}
        </div>
      ) : (
        <Link
          href={href}
          key={label}
          onClick={closeMobileMenu}
          className={`font-normal flex items-center whitespace-nowrap transition-colors ${
            isActive ? "text-primary" : "text-foreground hover:text-primary"
          }`}
        >
          {label}
        </Link>
      );
    })}
  </nav>
);

interface AuthButtonsProps {
  direction?: "row" | "col";
  signin: () => void;
  signup: () => void;
  isMobile?: boolean;
  closeMobileMenu?: () => void;
}

const AuthButtons = ({
  direction = "row",
  signin,
  signup,
  isMobile = false,
  closeMobileMenu,
}: AuthButtonsProps) => {
  const spacing =
    direction === "row" ? "flex items-center space-x-4" : "flex flex-col items-center space-y-4";

  const handleSignin = () => {
    signin();
    closeMobileMenu?.();
  };

  const handleSignup = () => {
    signup();
    closeMobileMenu?.();
  };

  return (
    <div className={`${spacing} ${isMobile ? "mt-4 w-full" : ""}`}>
      <Button
        variant="outline"
        className="text-primary border-primary w-full md:w-auto"
        onClick={handleSignup}
      >
        S'inscrire
      </Button>
      <Button onClick={handleSignin} className="text-white w-full md:w-auto">
        Se connecter
      </Button>
    </div>
  );
};

export default function Header() {
  const { logout } = useLogout();
  const currentUser = useSelector(selectCurrentUser);
  const { isDialogOpen, setIsDialogOpen, handleUserRoles } = useRoleSelection();
  const roles = currentUser?.roles;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Add this hook to get current path
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleDashboardClick = () => {
    if (roles && roles.length > 0) {
      handleUserRoles(roles);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="py-2 shadow-sm sticky top-0 z-30 backdrop-blur-xl bg-[#FFFFFFCC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between h-16 items-center w-full">
          {/* Logo - fixed width */}
          <div className="flex-shrink-0 w-48">
            <Link href="/" className="flex items-center">
              <Image
                src="/tantor-logo.svg"
                height={32}
                width={32}
                alt="Tantor logo"
                className="h-8 w-8 mr-2"
              />
              <span className="text-[16px] font-[600] text-primary">Tantor Learning</span>
            </Link>
          </div>

          {/* Desktop Navigation - takes remaining space */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <NavLinks
              isAuthenticated={isAuthenticated}
              onDashboardClick={handleDashboardClick}
              className="flex-1 justify-center"
              currentPath={pathname}
            />
          </div>

          {/* Action Buttons - fixed width desktop */}
          <div className="hidden flex-shrink-0 w-48 md:flex justify-end">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Avatar className="inline-block static size-8">
                      <AvatarImage src={currentUser?.avatar} />
                      <AvatarFallback className="font-semibold bg-primary text-background">
                        {currentUser?.fs_name?.[0] || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{currentUser?.fs_name || "Anonymous"}</p>
                    <p className="text-xs font-light">{currentUser?.email || "mail"}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => await logout()}>
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthButtons
                signin={() => router.push("/signin")}
                signup={() => router.push("/signup")}
              />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Avatar className="inline-block static size-8">
                      <AvatarImage src={currentUser?.avatar} />
                      <AvatarFallback className="font-semibold bg-primary text-background">
                        {currentUser?.fs_name?.[0] || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{currentUser?.fs_name || "Anonymous"}</p>
                    <p className="text-xs font-light">{currentUser?.email || "mail"}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => await logout()}>
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <div className="md:hidden flex items-center ml-4">
              <button
                className="md:hidden hover:text-primary inline-flex items-center justify-center p-2 hover:text-primary-blue transition-colors duration-200 hover:cursor-pointer"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 transition-transform duration-300" />
                ) : (
                  <Menu className="h-6 w-6 transition-transform duration-300" />
                )}
                <span className="sr-only">Toggle menu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav links menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <NavLinks
              isAuthenticated={isAuthenticated}
              onDashboardClick={handleDashboardClick}
              isMobile
              closeMobileMenu={closeMobileMenu}
              currentPath={pathname}
            />

            {!isAuthenticated && (
              <AuthButtons
                direction="col"
                signin={() => router.push("/signin")}
                signup={() => router.push("/signup")}
                isMobile
                closeMobileMenu={closeMobileMenu}
              />
            )}
          </div>
        )}

        <RoleSelectionDialog
          roles={currentUser?.roles || []}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </div>
    </header>
  );
}
