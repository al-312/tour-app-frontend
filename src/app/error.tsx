"use client";

import Link from "next/link";
import * as React from "react";
import { AlertTriangle } from "lucide-react";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): React.JSX.Element {
  React.useEffect((): void => {
    // Log the error to an external error reporting service if required
  }, [error]);

  return (
    <div className="grow flex items-center justify-center py-12 animate-slide-up">
      <Card className="max-w-md w-full text-center flex flex-col items-center gap-6 p-10 border-app-error/20 bg-app-error-bg/5">
        <div className="w-16 h-16 rounded-2xl bg-app-error-bg flex items-center justify-center text-app-error shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <Heading
          level={1}
          variant="headline-md"
          subheading="A systemic exception occurred while processing this experience. Our curation engines are investigating."
        >
          Operational Interruption
        </Heading>
        <div className="flex gap-4 w-full justify-center">
          <Button variant="outline" onClick={reset}>
            Try Again
          </Button>
          <Link href="/">
            <Button variant="primary">Return Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
