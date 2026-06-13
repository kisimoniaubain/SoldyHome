export default function BrandLogo({
  theme = 'light',
  compact = false,
  iconOnly = false,
  homeClassName,
}) {
  const isDark = theme === 'dark';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textAccent = homeClassName || (isDark ? 'text-amber-300' : 'text-amber-700');
  const iconContainer = isDark
    ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-orange-900/30'
    : 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-300/50';

  return (
    <div className="flex items-center gap-2.5">
      <div className={`rounded-xl flex items-center justify-center shadow-md ${iconContainer} ${compact ? 'w-9 h-9' : 'w-10 h-10'}`}>
        <svg
          viewBox="0 0 64 64"
          className={compact ? 'w-5 h-5' : 'w-6 h-6'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M10 37C10 30.3726 15.3726 25 22 25H42C48.6274 25 54 30.3726 54 37V44H10V37Z" fill="white" fillOpacity="0.95"/>
          <rect x="12" y="42" width="4" height="10" rx="2" fill="white"/>
          <rect x="48" y="42" width="4" height="10" rx="2" fill="white"/>
          <rect x="20" y="20" width="24" height="8" rx="4" fill="white" fillOpacity="0.95"/>
          <path d="M14 36V33C14 30.7909 15.7909 29 18 29H24C26.2091 29 28 30.7909 28 33V36" stroke="#C2410C" strokeWidth="2"/>
          <path d="M36 36V33C36 30.7909 37.7909 29 40 29H46C48.2091 29 50 30.7909 50 33V36" stroke="#C2410C" strokeWidth="2"/>
        </svg>
      </div>

      {!iconOnly && (
        <div className="leading-tight">
          <p className={`font-extrabold tracking-tight ${compact ? 'text-lg' : 'text-xl'} ${textPrimary}`}>
            Soldy
            <span className={`${textAccent}`}>Home</span>
          </p>
          {!compact && <p className={`text-[10px] uppercase tracking-[0.2em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Furniture Studio</p>}
        </div>
      )}
    </div>
  );
}
