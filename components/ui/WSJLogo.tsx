import React from "react";

interface WSJLogoProps {
  className?: string;
}

export const WSJLogo: React.FC<WSJLogoProps> = ({
  className = "w-full max-w-[460px] sm:max-w-[540px] md:max-w-[600px] h-[52px] sm:h-[62px] md:h-[70px] mx-auto block select-none overflow-visible",
}) => {
  return (
    <div className={className}>
      <img
        src="/images/wsj-masthead.svg"
        alt="The Wall Street Journal"
        className="w-full h-full block mx-auto py-0 my-0 object-contain overflow-visible"
      />
    </div>
  );
};

export default WSJLogo;
