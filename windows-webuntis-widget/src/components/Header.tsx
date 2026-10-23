import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateForHeader } from "@/lib/date";

interface HeaderProps {
  selectedDate: Date;
  clockText: string;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onRefresh: () => void;
}

export function Header({
  selectedDate,
  clockText,
  onPreviousDay,
  onNextDay,
  onRefresh,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold">
        U
      </div>

      <span className="text-xs">{formatDateForHeader(selectedDate)}</span>

      <div className="flex items-center gap-0.5">
        <Button size="icon-xs" variant="ghost" onClick={onPreviousDay}>
          <ChevronLeft className="size-3" />
        </Button>
        <Button size="icon-xs" variant="ghost" onClick={onNextDay}>
          <ChevronRight className="size-3" />
        </Button>
      </div>

      <span className="text-xs text-muted-foreground">{clockText}</span>

      <Button size="icon-xs" variant="ghost" onClick={onRefresh}>
        <RefreshCw className="size-3" />
      </Button>
    </div>
  );
}
