import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  dark?: boolean;
}

export function Logo({ className = "", size = "md", dark = false }: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Brand Icon Shield/Decision Badge */}
      <div
        className={`${iconSizes[size]} relative rounded-xl flex items-center justify-center font-black shadow-sm overflow-hidden bg-gradient-to-br from-[#159653] to-[#0B2345] text-white border border-emerald-400/30`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5 text-white"
        >
          {/* Stylized K / Decision Compass Node */}
          <path
            d="M12 2L20 7V17L12 22L4 17V7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-40"
          />
          <path
            d="M12 6V18M12 12L17 7M12 12L17 17"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <span
        className={`${textSizes[size]} font-extrabold tracking-tight ${
          dark ? "text-white" : "text-[#0B2345]"
        }`}
      >
        Karar<span className="text-[#159653]">OS</span>
      </span>
    </div>
  );
}
