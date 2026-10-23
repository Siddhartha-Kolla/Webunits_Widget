import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateForBackend } from "@/lib/date";
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

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}

// How far we are through the day, from 0 to 1. Counted in lessons and not in
// minutes, because the rows are all the same height.
function getDayProgress(lessons: SimpleLesson[]): number {
  if (lessons.length === 0) return 0;

  const now = new Date();
  const today = formatDateForBackend(now);
  if (lessons[0].date < today) return 1;
  if (lessons[0].date > today) return 0;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let done = 0;
  for (const lesson of lessons) {
    const start = toMinutes(lesson.start_time);
    const end = toMinutes(lesson.end_time);
    if (nowMinutes >= end) {
      done += 1;
    } else if (nowMinutes > start) {
      done += (nowMinutes - start) / (end - start);
    }
  }

  return done / lessons.length;
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
      <div className="relative flex flex-col gap-1 pl-3 pr-3">
        {/* the bar in the middle: grey is the whole day, purple is what's already over */}
        <div className="absolute left-0 top-0 h-full w-1 rounded bg-accent" />
        <div
          className="absolute left-0 top-0 w-1 rounded bg-primary"
          style={{ height: `${getDayProgress(lessons) * 100}%` }}
        />

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
