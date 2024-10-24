"use client";

import { CardHeaderProps } from "./type";

export const CardHeader = ({ title, description }: CardHeaderProps) => {
  return (
    <div className="mb-2">
      {title && <h3 className="font-bold text-sm">{title}</h3>}
      {description && (
        <p className="text-xs font-light text-primary-500/60">{description}</p>
      )}
    </div>
  );
};
