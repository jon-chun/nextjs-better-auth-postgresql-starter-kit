"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PasswordStrengthIndicator } from "@/components/shared/password-strength-indicator";
import { ROUTES } from "@/lib/constants";
import { signUpSchema } from "@/lib/validations";
import { authClient } from "@/lib/auth-client";
import { Chrome, CheckCircle2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate with Zod schema
    try {
      signUpSchema.parse({
        email: formData.email,
        name: formData.name || undefined,
        password: formData.password,
      });
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the Terms of Service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name || "",
      });

      if (result.error) {
        setErrors({
          general: result.error.message || "Failed to create account",
        });
        setIsLoading(false);
        return;
      }

      // Show success message - user needs to verify email
      setEmailSent(true);
      setIsLoading(false);
    } catch (error: any) {
      setErrors({
        general: error.message || "An unexpected error occurred",
      });
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // OAuth sign-up will be implemented in later phase
    setErrors({
      general: "Google sign-up will be available soon",
    });
  };

  // Show success message if email was sent
  if (emailSent) {
    return (
      <Card>
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to <strong>{formData.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4 text-sm">
            <p className="mb-2 font-medium">Next steps:</p>
            <ol className="list-inside list-decimal space-y-1 text-muted-foreground">
              <li>Check your email inbox</li>
              <li>Click the verification link in the email</li>
              <li>Sign in to start creating plushies!</li>
            </ol>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setEmailSent(false)}
              className="underline hover:text-primary"
            >
              try again
            </button>
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={ROUTES.SIGN_IN}>Go to Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your details to get started with PlushifyMe
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errors.general && (
          <div className="mb-4 rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
            {errors.general}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
              className={errors.name ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrors({ ...errors, email: "" });
              }}
              className={errors.email ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setErrors({ ...errors, password: "" });
              }}
              className={errors.password ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
            <PasswordStrengthIndicator password={formData.password} />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                setErrors({ ...errors, confirmPassword: "" });
              }}
              className={errors.confirmPassword ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => {
                  setFormData({ ...formData, acceptTerms: checked as boolean });
                  setErrors({ ...errors, acceptTerms: "" });
                }}
                disabled={isLoading}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link
                  href={ROUTES.TERMS}
                  className="underline hover:text-primary"
                >
                  Terms of Service
                </Link>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-destructive">{errors.acceptTerms}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            OR CONTINUE WITH
          </span>
        </div>

        {/* Google Sign Up */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          <Chrome className="mr-2 h-4 w-4" />
          Sign up with Google
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Link href={ROUTES.SIGN_IN} className="underline hover:text-primary">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
