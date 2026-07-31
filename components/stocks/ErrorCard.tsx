import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ErrorCard({
  title = "Something went wrong",
  message,
  backHref = "/dashboard",
  backLabel = "Back to dashboard",
}: {
  title?: string;
  message: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <Card className="border border-destructive/30 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-4" aria-hidden="true" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{message}</p>
        <Link
          href={backHref}
          className="inline-flex text-sm font-medium text-emerald-400 hover:text-emerald-300"
        >
          {backLabel}
        </Link>
      </CardContent>
    </Card>
  );
}

