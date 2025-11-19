import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Logo */}
      <header className="border-b">
        <div className="container py-4">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <Image
              src="/images/logo/logo.svg"
              alt="PlushifyMe"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold">PlushifyMe</span>
          </Link>
        </div>
      </header>

      {/* Main Content - Centered Form */}
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
