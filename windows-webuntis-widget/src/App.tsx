import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Header } from "@/components/Header";
import { CurrentLessonPanel } from "@/components/CurrentLessonPanel";
import { LessonList } from "@/components/LessonList";
import { formatDateForBackend } from "@/lib/date";
import type { SimpleLesson } from "@/lib/types";

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lessons, setLessons] = useState<SimpleLesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<SimpleLesson | null>(null);
  const [nextLesson, setNextLesson] = useState<SimpleLesson | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clockText, setClockText] = useState("");

  // Load the timetable every time the selected day changes.
  useEffect(() => {
    loadDay();
  }, [selectedDate]);

  // Once when the app starts, figure out what lesson is happening right now.
  useEffect(() => {
    loadCurrentLesson();
  }, []);

  // Keep the little clock in the header up to date.
  useEffect(() => {
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setClockText(`${hours}:${minutes}`);
  }

  async function loadDay() {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const dateText = formatDateForBackend(selectedDate);
      const dayLessons = await invoke<SimpleLesson[]>("get_day_timetable", {
        date: dateText,
      });
      // untis doesn't give us the lessons in order, "HH:MM" sorts fine as text
      // the 00:00 - 23:59 entries are all day events, not real lessons, so we skip them
      const realLessons = dayLessons.filter(
        (lesson) => !(lesson.start_time === "00:00" && lesson.end_time === "23:59"),
      );
      realLessons.sort((a, b) => a.start_time.localeCompare(b.start_time));
      setLessons(realLessons);
    } catch (error) {
      setErrorMessage(String(error));
    }
    setIsLoading(false);
  }

  async function loadCurrentLesson() {
    try {
      const lesson = await invoke<SimpleLesson | null>("get_current_lesson");
      setCurrentLesson(lesson);

      if (lesson) {
        loadNextLessonForSubject(lesson.subject);
      } else {
        setNextLesson(null);
      }
    } catch (error) {
      setErrorMessage(String(error));
    }
  }

  async function loadNextLessonForSubject(subject: string) {
    try {
      const lesson = await invoke<SimpleLesson | null>(
        "get_next_lesson_for_subject",
        { subject },
      );
      // lesson can be null here if it's not found in the next 60 days, and that's fine.
      setNextLesson(lesson);
    } catch (error) {
      setErrorMessage(String(error));
    }
  }

  function goToPreviousDay() {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(previousDay.getDate() - 1);
    setSelectedDate(previousDay);
  }

  function goToNextDay() {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  }

  function refreshEverything() {
    loadDay();
    loadCurrentLesson();
  }

  return (
    <main className="h-full w-full flex flex-col gap-2 p-3 text-foreground">
      <Header
        selectedDate={selectedDate}
        clockText={clockText}
        onPreviousDay={goToPreviousDay}
        onNextDay={goToNextDay}
        onRefresh={refreshEverything}
      />

      {errorMessage && (
        <p className="text-xs text-destructive">{errorMessage}</p>
      )}

      <div className="flex flex-1 gap-2 overflow-hidden">
        <CurrentLessonPanel currentLesson={currentLesson} nextLesson={nextLesson} />
        <LessonList lessons={lessons} isLoading={isLoading} />
      </div>
    </main>
  );
}

export default App;
