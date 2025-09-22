"use client";
import { ReactNode, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AuthSkeleton } from "@/components/skeletons/auth-skeleton";

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto py-16 max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg">
            <Card className="border shadow-none rounded">
              <CardContent>
                <Suspense fallback={<AuthSkeleton />}>{children}</Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
