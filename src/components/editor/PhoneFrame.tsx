'use client';

import type { ReactNode } from 'react';

interface PhoneFrameProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  children: ReactNode;
  onClick?: () => void;
}

export function PhoneFrame({
  width = 375,
  height = 812,
  backgroundColor = '#FAFAFA',
  children,
  onClick,
}: PhoneFrameProps) {
  return (
    <div
      className="relative border-2 border-gray-300 rounded-[2.5rem] shadow-xl bg-white overflow-hidden"
      style={{ width: width + 24, height: height + 24 }}
    >
      {/* 노치 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-300 rounded-b-xl z-10" />

      {/* 캔버스 */}
      <div
        className="relative mx-3 my-3 overflow-hidden"
        style={{ width, height, backgroundColor }}
        onClick={onClick}
      >
        {children}
      </div>
    </div>
  );
}
