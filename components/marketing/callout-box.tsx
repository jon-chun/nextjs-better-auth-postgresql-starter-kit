import { AlertCircle, AlertTriangle, Info, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutVariant = "info" | "warning" | "tip" | "danger";

interface CalloutBoxProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}

const variantConfig = {
  info: {
    icon: Info,
    containerClass:
      "border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900",
    iconClass: "text-blue-600 dark:text-blue-400",
    titleClass: "text-blue-900 dark:text-blue-300",
  },
  warning: {
    icon: AlertTriangle,
    containerClass:
      "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900",
    iconClass: "text-yellow-600 dark:text-yellow-400",
    titleClass: "text-yellow-900 dark:text-yellow-300",
  },
  tip: {
    icon: Lightbulb,
    containerClass:
      "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900",
    iconClass: "text-green-600 dark:text-green-400",
    titleClass: "text-green-900 dark:text-green-300",
  },
  danger: {
    icon: AlertCircle,
    containerClass:
      "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900",
    iconClass: "text-red-600 dark:text-red-400",
    titleClass: "text-red-900 dark:text-red-300",
  },
} as const;

export function CalloutBox({
  variant = "info",
  title,
  children,
}: CalloutBoxProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className={cn("rounded-lg border p-4", config.containerClass)}>
      <div className="flex gap-3">
        <Icon
          className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.iconClass)}
        />
        <div className="flex-1 space-y-2">
          {title && (
            <p className={cn("font-semibold", config.titleClass)}>{title}</p>
          )}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
