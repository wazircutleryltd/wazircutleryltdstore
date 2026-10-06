"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked: controlledChecked, defaultChecked = false, onCheckedChange, disabled, id }, ref) => {
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : uncontrolledChecked;

    const handleClick = () => {
      if (disabled) return;
      const nextChecked = !isChecked;
      if (!isControlled) {
        setUncontrolledChecked(nextChecked);
      }
      onCheckedChange?.(nextChecked);
    };

    return (
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={isChecked ? 'true' : 'false'}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          `peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6AF66] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${isChecked ? 'bg-[#D6AF66]' : 'bg-[#E5E5E5]'}`,
          className
        )}
        ref={ref}
      >
        <span
          className={cn(
            `pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${isChecked ? 'translate-x-5' : 'translate-x-0'}`
          )}
        />
      </button>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
