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
        "w-full max-w-[1550px] mx-auto px-4 sm:px-6 xl:px-[3cm]",
        className
      )}
    >
      {children}
    </Component>
  );
};

export default Container;
