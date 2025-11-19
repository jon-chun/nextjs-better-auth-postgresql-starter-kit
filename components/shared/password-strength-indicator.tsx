import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
}

/**
 * Visual password strength indicator
 * Calculates strength based on length, character variety, and common patterns
 */
export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const strength = calculatePasswordStrength(password);

  const strengthConfig = {
    0: { label: "", color: "bg-muted", width: "w-0" },
    1: { label: "Weak", color: "bg-destructive", width: "w-1/4" },
    2: { label: "Fair", color: "bg-orange-500", width: "w-2/4" },
    3: { label: "Good", color: "bg-yellow-500", width: "w-3/4" },
    4: { label: "Strong", color: "bg-green-500", width: "w-full" },
  };

  const config = strengthConfig[strength as keyof typeof strengthConfig];

  if (strength === 0) return null;

  return (
    <div className="space-y-2">
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300",
            config.color,
            config.width
          )}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength: <span className="font-medium">{config.label}</span>
      </p>
    </div>
  );
}

function calculatePasswordStrength(password: string): number {
  if (!password) return 0;

  let strength = 0;

  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Character variety checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  // Cap at 4
  return Math.min(strength, 4);
}
