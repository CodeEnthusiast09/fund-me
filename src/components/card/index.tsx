"use client";

import { CardProps } from "./type";
import { CardHeader } from "./card-header";
import clsx from "clsx";

export const Card = ({
  title,
  description,
  className,
  children,
  py = "py-8",
}: CardProps) => {
  return (
    <div
      className={clsx(
        "bg-lightGray rounded-lg px-5",
        className,
        py
      )}
    >
      {title && <CardHeader title={title} description={description} />}
      {children}
    </div>
  );
};
