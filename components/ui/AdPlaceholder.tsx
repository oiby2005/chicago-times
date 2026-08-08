import React from "react";

interface AdPlaceholderProps {
  width?: string;
  height?: string;
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  width = "w-full",
  height = "h-[250px]",
  className = "",
}) => {
  return (
    <div className={`my-4 flex flex-col items-center justify-center ${className}`}>
      <span className="text-[11px] font-sans text-[#767676] mb-1 tracking-tight">
        Advertisement
      </span>
      <div
        className={`${width} ${height} bg-[#f4f4f4] border border-[#d4d4d4] flex flex-col items-center justify-center text-center p-4 rounded-xs`}
      >
        <span className="text-xs font-sans font-bold text-[#888888] tracking-widest uppercase">
          Advertisement
        </span>
      </div>
    </div>
  );
};

export default AdPlaceholder;
