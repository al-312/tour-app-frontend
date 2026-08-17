import Link from "next/link";
import * as React from "react";
import { Compass } from "lucide-react";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="grow flex items-center justify-center py-12 animate-slide-up">
      <Card className="max-w-md w-full text-center flex flex-col items-center gap-6 p-10">
        <div className="w-16 h-16 rounded-2xl bg-app-brand-bg flex items-center justify-center text-app-brand shadow-sm">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        <Heading
          level={1}
          variant="headline-md"
          subheading="The destination you are seeking does not exist in our curated portfolios."
        >
          404 • Destination Uncharted
        </Heading>
        <Link href="/">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
