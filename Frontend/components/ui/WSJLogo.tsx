import React from "react";

interface WSJLogoProps {
  className?: string;
}

export const WSJLogo: React.FC<WSJLogoProps> = ({
  className = "w-full max-w-[320px] sm:max-w-[370px] md:max-w-[420px] h-[50px] sm:h-[58px] md:h-[66px] mx-auto block select-none overflow-visible",
}) => {
  return (
    <div className={className}>
      <img
        src="/images/design-reference/Times Chicago.svg"
        alt="Times Chicago"
        className="w-full h-full block mx-auto py-0 my-0 object-contain overflow-visible"
      />
    </div>
  );
};

export default WSJLogo;
