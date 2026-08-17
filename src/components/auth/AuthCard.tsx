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
    <div className="min-h-screen w-full flex items-center justify-center bg-app-bg text-app-fg p-4 md:p-8 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-app-brand/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-app-surface border border-app-border rounded-3xl p-8 shadow-2xl shadow-black/10 backdrop-blur-md relative z-10 flex flex-col gap-6 animate-fade-in">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-app-brand to-emerald-600 flex items-center justify-center shadow-lg shadow-app-brand/25 text-white font-black text-xl mb-2">
            T
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-app-fg">{title}</h1>
          <p className="text-sm text-app-muted max-w-xs">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
