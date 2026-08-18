import * as React from "react";

import Card from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  subtitle?: string | undefined;
  children: React.ReactNode;
  footer?: React.ReactNode | undefined;
}

function AuthBrandBadge(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-app-brand via-emerald-400 to-app-brand opacity-40 blur-xs transition duration-300 group-hover:opacity-75" />
        <div className="relative w-14 h-14 rounded-2xl bg-linear-to-tr from-app-brand via-brand-500 to-emerald-400 flex items-center justify-center font-extrabold text-white text-2xl shadow-xl shadow-app-brand/25">
          A
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <span className="text-xs font-bold uppercase tracking-widest text-app-brand font-label-caps">
          AuraTours
        </span>
        <span className="w-1 h-1 rounded-full bg-app-muted/40" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-app-muted font-label-caps">
          Executive Portal
        </span>
      </div>
    </div>
  );
}

const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  children,
  footer,
}): React.JSX.Element => {
  return (
    <Card className="w-full max-w-md p-8 sm:p-10 shadow-2xl border-app-border/60 bg-app-surface/95 backdrop-blur-2xl rounded-3xl animate-fade-in relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center text-center mb-6">
        <AuthBrandBadge />
        <h1 className="text-2xl font-black tracking-tight text-app-fg font-display-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-app-muted text-xs font-medium mt-1.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="relative z-10">{children}</div>

      {footer && (
        <div className="relative z-10 mt-6 pt-5 border-t border-app-border/40 text-center text-xs text-app-muted font-medium">
          {footer}
        </div>
      )}
    </Card>
  );
};

export default AuthCard;
