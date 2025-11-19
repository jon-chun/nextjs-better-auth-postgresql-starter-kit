"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. Please check your email.");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage("Your email has been verified successfully!");
          // Redirect to sign-in after 3 seconds
          setTimeout(() => {
            router.push(ROUTES.SIGN_IN);
          }, 3000);
        } else {
          setStatus("error");
          setMessage(
            data.error ||
              "Failed to verify email. The link may have expired. Please request a new verification email.",
          );
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Verifying your email...
            </CardTitle>
            <CardDescription>
              Please wait while we verify your email address
            </CardDescription>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Email Verified!
            </CardTitle>
            <CardDescription>
              Your email has been successfully verified
            </CardDescription>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Verification Failed
            </CardTitle>
            <CardDescription>
              We couldn&apos;t verify your email address
            </CardDescription>
          </>
        )}
      </CardHeader>

      <CardContent>
        {status === "loading" && (
          <p className="text-center text-sm text-muted-foreground">
            This should only take a moment...
          </p>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <p className="text-center text-sm">{message}</p>
            <div className="rounded-lg border bg-muted/50 p-4 text-sm">
              <p className="mb-2 font-medium">You can now:</p>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                <li>Sign in to your account</li>
                <li>Start uploading photos</li>
                <li>Create amazing plushie transformations!</li>
              </ul>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Redirecting to sign in page in 3 seconds...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {message}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Need help? Contact our support team or try signing up again.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {status === "success" && (
          <Button asChild className="w-full">
            <Link href={ROUTES.SIGN_IN}>Sign In Now</Link>
          </Button>
        )}

        {status === "error" && (
          <>
            <Button asChild className="w-full">
              <Link href={ROUTES.SIGN_UP}>Try Signing Up Again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={ROUTES.SIGN_IN}>Go to Sign In</Link>
            </Button>
          </>
        )}

        {status !== "loading" && (
          <Button asChild variant="ghost" className="w-full">
            <Link href={ROUTES.HOME}>Back to Home</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
