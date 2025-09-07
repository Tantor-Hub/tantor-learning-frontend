import { ReactNode, Suspense } from "react";
import { CookieMessage } from "@/components/shared/cookie-message";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Loading } from "@/components/shared/loading";

export default function ExternalLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[50vh]">
            <Loading />;
          </div>
        }
      >
        {children}
      </Suspense>
      <Footer />
      <CookieMessage />
    </>
  );
}
