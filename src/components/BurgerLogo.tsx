import React from 'react';

interface BurgerLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  greeting?: string;
  showGreeting?: boolean;
}

export const BurgerLogo: React.FC<BurgerLogoProps> = ({
  className = '',
  size = 'md',
  greeting = 'Hi, Burger Lover! 🍔',
  showGreeting = true
}) => {
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl';
  const subSize = size === 'sm' ? 'text-[8.5px]' : size === 'lg' ? 'text-[11px]' : 'text-[9.5px]';

  return (
    <div className={`flex flex-col items-center justify-center select-none text-center ${className}`}>
      {showGreeting && (
        <span className="text-[10px] sm:text-xs font-semibold text-gray-800 tracking-tight flex items-center gap-1 mb-0.5">
          {greeting}
        </span>
      )}

      {/* Main Papa John's style Arched / Impact Wordmark */}
      <div className="flex items-center justify-center tracking-tight leading-none">
        <span
          className={`font-black ${titleSize} tracking-[-0.03em] uppercase text-[#E31837] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]`}
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 950 }}
        >
          BURGER JOINTS
        </span>
      </div>

      {/* Green Tagline */}
      <span
        className={`${subSize} font-bold text-[#005A36] tracking-[0.02em] leading-tight mt-0.5`}
      >
        Better Ingredients. Better Burgers.
      </span>
    </div>
  );
};

