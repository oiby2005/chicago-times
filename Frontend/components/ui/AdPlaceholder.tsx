import React from "react";

interface AdPlaceholderProps {
  width?: string;
  height?: string;
  resolution?: string; // e.g. "728 × 90", "300 × 250", "300 × 600", "970 × 250"
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  width = "w-full",
  height = "h-[250px]",
  resolution = "300 × 250",
  className = "",
}) => {
  return (
    <div className={`my-3 flex flex-col items-center justify-center select-none w-full ${className}`}>
      {/* Empty Banner Container with resolution size in middle section */}
      <div
        className={`${width} ${height} bg-[#f5f5f5] border border-dashed border-[#cccccc] flex items-center justify-center text-center p-4 rounded-xs shadow-2xs transition-colors hover:bg-[#eaeaea]`}
      >
        <span className="text-xs font-mono font-bold text-[#444444] bg-white px-3.5 py-1.5 rounded-xs border border-[#d0d0d0] shadow-2xs">
          {resolution}
        </span>
      </div>
    </div>
  );
};

export default AdPlaceholder;
