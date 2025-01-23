import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function TypographyH1({
  children,
  className = "",
}: PropsWithChildren & { className?: string }) {
  return (
    <h1
      className={cn(
        className,
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
      )}
    >
      {children}
    </h1>
  );
}
