import type { SimpleLesson } from "@/lib/types";

interface CurrentLessonPanelProps {
  currentLesson: SimpleLesson | null;
  nextLesson: SimpleLesson | null;
}

// The left side of the widget: what lesson is happening right now, and when the same subject happens next.
export function CurrentLessonPanel({
  currentLesson,
  nextLesson,
}: CurrentLessonPanelProps) {
  return (
    <div className="flex w-[110px] shrink-0 flex-col gap-1">
      {currentLesson ? (
        <>
          <p className="font-bold text-primary">{currentLesson.subject}</p>
          <p className="text-xs text-muted-foreground">
            {currentLesson.start_time} - {currentLesson.end_time}
          </p>
          <p className="text-xs text-muted-foreground">
            Raum {currentLesson.room}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentLesson.teacher}
          </p>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">Gerade keine Stunde</p>
      )}

      {nextLesson && (
        <p className="mt-auto text-xs text-muted-foreground">
          nächste Stunde: {nextLesson.date}
        </p>
      )}
    </div>
  );
}
