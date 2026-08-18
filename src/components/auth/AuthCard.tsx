import * as React from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthCard({
  title,
  subtitle,
  children,
}: AuthCardProps): React.JSX.Element {
  return (
    <div className="w-full flex items-center justify-center bg-app-bg text-app-fg p-4 sm:p-6 transition-colors duration-300 relative my-auto">
      {/* Full-viewport soft ambient glow without hard clipping */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-app-brand/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-md bg-app-surface border border-app-border rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/10 backdrop-blur-md relative z-10 flex flex-col gap-5 animate-fade-in">
        <div className="flex flex-col items-center text-center gap-1.5">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-app-brand to-emerald-600 flex items-center justify-center shadow-lg shadow-app-brand/25 text-white font-black text-xl mb-1">
            T
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-app-fg">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-app-muted max-w-xs">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
