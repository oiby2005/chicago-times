import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  as: Component = "div",
}) => {
  return (
    <Component
      className={cn(
        "w-full max-w-[1280px] mx-auto px-2 sm:px-3 md:px-4",
        className
      )}
    >
      {children}
    </Component>
  );
};

export default Container;
