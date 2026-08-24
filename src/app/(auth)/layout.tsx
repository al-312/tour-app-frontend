import * as React from "react";

function AmbientBackgroundGlows(): React.JSX.Element {
  return (
    <>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-app-brand/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-linear-to-r from-app-brand/5 via-emerald-500/5 to-app-brand/5 rounded-full blur-3xl pointer-events-none" />
    </>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="min-h-screen bg-app-bg text-app-fg flex flex-col justify-center items-center p-6 relative overflow-hidden transition-colors duration-300">
      <AmbientBackgroundGlows />
      <main className="w-full max-w-md z-10 flex flex-col items-center">{children}</main>
    </div>
  );
}
