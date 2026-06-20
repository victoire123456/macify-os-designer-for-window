import React, { useState } from 'react';
import { Apple } from 'lucide-react';

interface AppLogoProps {
  size?: number;
  className?: string;
  forceApple?: boolean;
}

export default function AppLogo({ size = 14, className = '', forceApple = false }: AppLogoProps) {
  const [errorUsd, setErrorUsd] = useState(false);

  if (forceApple || errorUsd) {
    return <Apple size={size} className={className} />;
  }

  return (
    <img
      src="/loge.png"
      alt="Macify"
      className={`${className} object-contain`}
      style={{ width: `${size}px`, height: `${size}px` }}
      onError={() => setErrorUsd(true)}
      referrerPolicy="no-referrer"
    />
  );
}
