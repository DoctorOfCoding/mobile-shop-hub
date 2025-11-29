import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  variant?: "default" | "primary" | "accent" | "success" | "warning";
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  variant = "default",
  className,
}: StatCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  const variantStyles = {
    default: "bg-card",
    primary: "gradient-primary text-primary-foreground",
    accent: "gradient-accent text-accent-foreground",
    success: "gradient-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
  };

  const iconBgStyles = {
    default: "bg-primary/10 text-primary",
    primary: "bg-primary-foreground/20 text-primary-foreground",
    accent: "bg-accent-foreground/20 text-accent-foreground",
    success: "bg-success-foreground/20 text-success-foreground",
    warning: "bg-warning-foreground/20 text-warning-foreground",
  };

  return (
    <div
      className={cn(
        "rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300",
        "animate-fade-in",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p
            className={cn(
              "text-sm font-medium",
              variant === "default" ? "text-muted-foreground" : "opacity-80"
            )}
          >
            {title}
          </p>
          <p className="text-2xl font-display font-bold">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1.5">
              {isPositive && <TrendingUp className="w-4 h-4 text-success" />}
              {isNegative && <TrendingDown className="w-4 h-4 text-destructive" />}
              <span
                className={cn(
                  "text-sm font-medium",
                  variant === "default"
                    ? isPositive
                      ? "text-success"
                      : "text-destructive"
                    : "opacity-80"
                )}
              >
                {isPositive && "+"}
                {trend}%
              </span>
              {trendLabel && (
                <span
                  className={cn(
                    "text-sm",
                    variant === "default" ? "text-muted-foreground" : "opacity-60"
                  )}
                >
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconBgStyles[variant])}>{icon}</div>
      </div>
    </div>
  );
}
