import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateForHeader } from "@/lib/date";
import webuntisLogo from "@/assets/webuntis-logo.svg";

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
      <img src={webuntisLogo} alt="WebUntis" className="h-6 w-6" />

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
