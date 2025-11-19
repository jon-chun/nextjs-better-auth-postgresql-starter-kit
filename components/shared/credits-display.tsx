import { Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CreditsDisplayProps {
  credits: number;
  variant?: "default" | "large";
  className?: string;
}

/**
 * Credits badge component showing remaining credits count
 */
export function CreditsDisplay({
  credits,
  variant = "default",
  className,
}: CreditsDisplayProps) {
  if (variant === "large") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border bg-card p-4",
          className
        )}
      >
        <div className="rounded-full bg-primary/10 p-2">
          <Coins className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Credits Remaining</p>
          <p className="text-2xl font-bold">{credits}</p>
        </div>
      </div>
    );
  }

  return (
    <Badge variant="secondary" className={cn("gap-1.5", className)}>
      <Coins className="h-3.5 w-3.5" />
      <span className="font-medium">{credits} credits</span>
    </Badge>
  );
}
