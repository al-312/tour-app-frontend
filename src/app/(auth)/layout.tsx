import * as React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="min-h-screen bg-app-bg text-app-fg flex flex-col justify-center items-center p-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-app-brand/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <main className="w-full max-w-md z-10">{children}</main>
    </div>
  );
}
