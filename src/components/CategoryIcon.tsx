import React from 'react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = "w-6 h-6" }) => {
  const norm = name?.toLowerCase() || '';

  // 1. BURGER
  if (norm.includes('burger') || norm === 'beef') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 11C4 7 7.5 4 12 4C16.5 4 20 7 20 11H4Z" />
        <path d="M3 14H21" />
        <path d="M4 17C4 18.5 6 20 12 20C18 20 20 18.5 20 17H4Z" />
        <path d="M8 7.5H8.01" strokeWidth="2.5" />
        <path d="M12 6.5H12.01" strokeWidth="2.5" />
        <path d="M16 7.5H16.01" strokeWidth="2.5" />
      </svg>
    );
  }

  // 2. FRIES
  if (norm.includes('frie') || norm.includes('utensils')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 10L7 21H17L18 10" />
        <path d="M7 10C8.5 12 15.5 12 17 10" />
        <path d="M9 3V10" />
        <path d="M12 2V10" />
        <path d="M15 3V10" />
        <path d="M7 5L8.5 10" />
        <path d="M17 5L15.5 10" />
      </svg>
    );
  }

  // 3. DRINKS
  if (norm.includes('drink') || norm.includes('soda') || norm.includes('cup')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 8L7.5 21H16.5L18 8H6Z" />
        <path d="M5 8H19" />
        <path d="M15 2L13 8" />
        <path d="M10 13H14" />
      </svg>
    );
  }

  // 4. SIDES (Dipping Sauce / Bowl)
  if (norm.includes('side') || norm.includes('soup')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 11C4 16 7.5 19 12 19C16.5 19 20 16 20 11H4Z" />
        <path d="M3 11H21" />
        <path d="M9 19L8 21H16L15 19" />
        <path d="M12 5C12 7 13 8 13 11" />
        <path d="M8 7C8 8.5 9 9.5 9 11" />
      </svg>
    );
  }

  // 5. COMBOS (Burger + Drink)
  if (norm.includes('combo') || norm.includes('layer')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* Small Burger on Left */}
        <path d="M3 15C3 12.5 5 11 8 11C11 11 13 12.5 13 15H3Z" />
        <path d="M3 17H13" />
        <path d="M4 19C4 20.5 5.5 21 8 21C10.5 21 12 20.5 12 19H4Z" />
        {/* Drink Cup on Right */}
        <path d="M15 11L16 21H21L22 11H15Z" />
        <path d="M14.5 11H22.5" />
        <path d="M19 6L18 11" />
      </svg>
    );
  }

  // 6. DESSERTS (Cupcake / Ice Cream)
  if (norm.includes('dessert') || norm.includes('icecream') || norm.includes('cake')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M7 13L8 21H16L17 13H7Z" />
        <path d="M6 13C6 10 9 10 9 8C9 6.5 10.5 5 12 5C13.5 5 15 6.5 15 8C15 10 18 10 18 13H6Z" />
        <path d="M12 2V5" />
        <circle cx="12" cy="3" r="1" fill="currentColor" />
      </svg>
    );
  }

  // Default
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2C8 6 6 9 6 13C6 17.5 9 21 12 21C15 21 18 17.5 18 13C18 9 16 6 12 2Z" />
    </svg>
  );
};
