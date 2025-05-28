"use client";
import { useEffect } from "react";
import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated } from "@/features/auth/auth-slice";
import { RoleSelectionDialog, useRoleSelection } from "@/components/role-selection-dialog";

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const { isDialogOpen, setIsDialogOpen, handleUserRoles } = useRoleSelection();

  useEffect(() => {
    const roles = currentUser?.roles;
    console.log("Roles length:", roles?.length);

    if (isAuthenticated && roles) {
      handleUserRoles(roles);
    }

    // Check for stored refresh token
    const storedToken = localStorage.getItem("refreshToken");
    if (storedToken && !isAuthenticated) {
      // You could dispatch a token refresh action here
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link href="/" className="flex gap-1 lg:gap-4 items-center ">
              <Image
                src="/tantor-logo.svg"
                height={48}
                width={48}
                alt="Tantor logo"
                className="h-8 w-auto lg:w-12"
              />
              <h1 className="text-nowrap text-[22px] border-b-2 border-red-500">Tantor Learning</h1>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">{children}</div>
          </div>
        </div>
        <div className="relative hidden bg-muted lg:block">
          <Image
            src="/sign-in-img.svg"
            alt="Image"
            width={500}
            height={500}
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
      <RoleSelectionDialog
        roles={currentUser?.roles || []}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
