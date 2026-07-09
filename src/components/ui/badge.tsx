import { clsx } from "clsx";
import { statusTone } from "@/lib/sample-data";

type StatusKey = keyof typeof statusTone;

export function Badge({
  status,
  children,
}: {
  status: StatusKey;
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        statusTone[status],
      )}
    >
      {children}
    </span>
  );
}
