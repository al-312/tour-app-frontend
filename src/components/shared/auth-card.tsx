import * as React from "react";

import Card from "@/components/ui/card";

function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string | undefined;
  children: React.ReactNode;
  footer?: React.ReactNode | undefined;
}): React.JSX.Element {
  return (
    <Card className="w-full max-w-md p-8 sm:p-10 shadow-2xl border-app-border/40 bg-app-surface/90 backdrop-blur-xl animate-fade-in">
      <div className="flex flex-col gap-2 text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-app-fg font-display-lg">
          {title}
        </h1>
        {subtitle && <p className="text-app-muted text-xs font-medium">{subtitle}</p>}
      </div>

      {children}

      {footer && (
        <div className="mt-8 pt-6 border-t border-app-border/40 text-center text-xs text-app-muted">
          {footer}
        </div>
      )}
    </Card>
  );
}

export default AuthCard;
