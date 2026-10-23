import { ScrollArea } from "@/components/ui/scroll-area";
import type { SimpleLesson } from "@/lib/types";

interface LessonListProps {
  lessons: SimpleLesson[];
  isLoading: boolean;
}

// üpicks a color for the little bar next to each lesson, based on its status
function colorForStatus(status: string): string {
  if (status === "cancelled") return "bg-destructive";
  if (status === "irregular") return "bg-yellow-500";
  return "bg-primary";
}

function LessonRow({ lesson }: { lesson: SimpleLesson }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <div className={`h-6 w-1 rounded ${colorForStatus(lesson.status)}`} />

      <div className="flex flex-col text-xs leading-tight">
        <span>{lesson.start_time}</span>
        <span className="text-muted-foreground">{lesson.end_time}</span>
      </div>

      <div className="flex flex-1 flex-col text-xs leading-tight">
        <span className="font-medium">{lesson.subject}</span>
        <span className="text-muted-foreground">{lesson.teacher}</span>
      </div>

      <span className="text-xs text-muted-foreground">{lesson.room}</span>
    </div>
  );
}

// The right side of the widget: the scrollable list of the day's lessons.
export function LessonList({ lessons, isLoading }: LessonListProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-1 pr-3">
        {isLoading && <p className="text-xs text-muted-foreground">Lädt...</p>}

        {!isLoading && lessons.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Keine Stunden an diesem Tag
          </p>
        )}

        {lessons.map((lesson) => (
          <LessonRow key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </ScrollArea>
  );
}
