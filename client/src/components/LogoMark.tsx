interface LogoMarkProps {
  size?: number;
  bgColor?: string;
}

export function LogoMark({ size = 34, bgColor = "#faf9f7" }: LogoMarkProps) {
  const id = `cg${size}${bgColor.replace("#","")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, display: "block" }}>
      <defs>
        <linearGradient id={`${id}-e`} x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00e5ff" />
          <stop offset="60%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <radialGradient id={`${id}-c`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00e5ff" />
          <stop offset="100%" stopColor="#0891b2" />
        </radialGradient>
      </defs>

      {/* Spoke edges from center */}
      <line x1="20" y1="20" x2="10" y2="9"  stroke={`url(#${id}-e)`} strokeWidth="1.3" strokeLinecap="round" />
      <line x1="20" y1="20" x2="32" y2="11" stroke={`url(#${id}-e)`} strokeWidth="1.3" strokeLinecap="round" />
      <line x1="20" y1="20" x2="34" y2="26" stroke={`url(#${id}-e)`} strokeWidth="1.3" strokeLinecap="round" />
      <line x1="20" y1="20" x2="14" y2="32" stroke={`url(#${id}-e)`} strokeWidth="1.3" strokeLinecap="round" />
      <line x1="20" y1="20" x2="7"  y2="25" stroke={`url(#${id}-e)`} strokeWidth="1.3" strokeLinecap="round" />

      {/* Cross-edges between outer nodes */}
      <line x1="10" y1="9"  x2="32" y2="11" stroke="#7c3aed" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.5" />
      <line x1="32" y1="11" x2="34" y2="26" stroke="#7c3aed" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.5" />
      <line x1="7"  y1="25" x2="14" y2="32" stroke="#4f46e5" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.5" />

      {/* Outer nodes */}
      <circle cx="10" cy="9"  r="2.5" fill={bgColor} stroke="#00c6e0" strokeWidth="1.2" />
      <circle cx="10" cy="9"  r="1.2" fill="#00c6e0" />
      <circle cx="32" cy="11" r="2.5" fill={bgColor} stroke="#00c6e0" strokeWidth="1.2" />
      <circle cx="32" cy="11" r="1.2" fill="#00c6e0" />
      <circle cx="34" cy="26" r="2"   fill={bgColor} stroke="#7c3aed" strokeWidth="1" />
      <circle cx="34" cy="26" r="1"   fill="#7c3aed" />
      <circle cx="14" cy="32" r="2"   fill={bgColor} stroke="#7c3aed" strokeWidth="1" />
      <circle cx="14" cy="32" r="1"   fill="#7c3aed" />
      <circle cx="7"  cy="25" r="2"   fill={bgColor} stroke="#4f46e5" strokeWidth="1" />
      <circle cx="7"  cy="25" r="1"   fill="#4f46e5" />

      {/* Center hub */}
      <circle cx="20" cy="20" r="4.5" fill={bgColor} stroke={`url(#${id}-e)`} strokeWidth="1.5" />
      <circle cx="20" cy="20" r="2.8" fill={`url(#${id}-c)`} />
      <circle cx="20" cy="20" r="1.2" fill="#fff" opacity="0.95" />
    </svg>
  );
}

interface LogoProps {
  size?: number;
  textColor?: string;
}

export function Logo({ size = 34, textColor = "#1a1a2e" }: LogoProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
      <LogoMark size={size} />
      <span style={{ fontWeight: 700, fontSize: "1.06rem", color: textColor, letterSpacing: "-0.02em" }}>
        <span style={{ color: "#00c6e0" }}>U</span>nkov
      </span>
    </div>
  );
}
