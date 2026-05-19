import React, { InputHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

export default function FormInput({
  label,
  icon: Icon,
  error,
  ...props
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-label-md text-on-surface-variant uppercase tracking-wide">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
          />
        )}

        <input
          {...props}
          className={` w-full rounded-xl border border-outline-variant bg-surface py-3 ${Icon ? "pl-10" : "pl-4"}  pr-4 text-on-surface focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all
                    `}
        />
      </div>

      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
