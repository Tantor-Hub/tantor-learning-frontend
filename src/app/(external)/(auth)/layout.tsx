"use client";
// import { useEffect } from "react";
import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated } from "@/features/auth/auth-slice";
import { RoleSelectionDialog, useRoleSelection } from "@/components/role-selection-dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const { isDialogOpen, setIsDialogOpen, handleUserRoles } = useRoleSelection();
  const roles = currentUser?.roles;

  // useEffect(() => {
  //   if (isAuthenticated && roles) {
  //     handleUserRoles(roles);
  //   }

  //   // Check for stored refresh token
  //   const storedToken = localStorage.getItem("refreshToken");
  //   if (storedToken && !isAuthenticated) {
  //     // You could dispatch a token refresh action here
  //   }
  // }, [isAuthenticated, router, roles, handleUserRoles]);

  return (
    <div className="bg-gray-50">
      <div className="mx-auto py-16 max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg">
            <Card className="border shadow-none rounded">
              <CardContent>{children}</CardContent>
            </Card>
          </div>
        </div>
      </div>
      <RoleSelectionDialog
        roles={currentUser?.roles || []}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
