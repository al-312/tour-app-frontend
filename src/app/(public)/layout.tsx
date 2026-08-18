import * as React from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-app-bg text-app-fg transition-colors duration-300">
      <main className="flex-1 flex flex-col justify-center w-full">{children}</main>
    </div>
  );
}
