
import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Severity = "information" | "review" | "warning" | "high_risk";

export function SeverityBadge({ severity, className }: { severity: Severity, className?: string }) {
  const config = {
    information: { icon: Info, text: "Information", classes: "bg-blue-50 text-blue-700 border-blue-200" },
    review: { icon: CheckCircle, text: "Review", classes: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    warning: { icon: AlertTriangle, text: "Warning", classes: "bg-orange-50 text-orange-700 border-orange-200" },
    high_risk: { icon: AlertCircle, text: "High Risk", classes: "bg-red-50 text-red-700 border-red-200" },
  };
  const Cfg = config[severity];
  const Icon = Cfg.icon;

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border", Cfg.classes, className)}>
      <Icon size={14} />
      {Cfg.text}
    </span>
  );
}
