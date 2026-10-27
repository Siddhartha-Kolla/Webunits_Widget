// This matches the SimpleLesson struct we return from Rust.
export interface SimpleLesson {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  subject: string;
  room: string;
  teacher: string;
  status: string;
}
