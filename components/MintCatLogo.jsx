export default function MintCatLogo({ className = "mintcat-logo", small = false }) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      width={small ? 30 : 44}
      height={small ? 30 : 44}
    >
      <path d="M24 31 33 14l13 13h4l13-13 9 17" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="18" y="27" width="60" height="48" rx="24" fill="currentColor" opacity="0.16" />
      <path d="M26 44c0-12.15 9.85-22 22-22s22 9.85 22 22-9.85 24-22 24-22-11.85-22-24Z" fill="currentColor" />
      <circle cx="40" cy="45" r="3.5" fill="#f7fffc" />
      <circle cx="56" cy="45" r="3.5" fill="#f7fffc" />
      <path d="M44 56c3.3 2.8 4.7 2.8 8 0" stroke="#f7fffc" strokeWidth="4" strokeLinecap="round" />
      <path d="M28 52 18 49M68 52l10-3M28 60 17 62M68 60l11 2" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="48" cy="52" r="2.5" fill="#f7fffc" />
    </svg>
  );
}
