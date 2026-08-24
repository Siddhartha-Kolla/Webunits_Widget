mod config;
use config::Config;
use chrono::{Duration, NaiveDate};
use serde::Serialize;
use untis::{Client, Date, Lesson, LessonCode};

// How many days ahead we search for the next lesson of a subject.
const NEXT_LESSON_SEARCH_DAYS: i64 = 7;

#[derive(Serialize, Clone)]
struct SimpleLesson {
    id: usize,
    date: String,
    start_time: String,
    end_time: String,
    subject: String,
    room: String,
    teacher: String,
    status: String,
}

fn login() -> Result<Client, String> {
    let config = Config::from_env()?;

    let client = Client::login(
        &config.school_server,
        &config.school_name,
        &config.server_username,
        &config.server_password,
    ).map_err(|err| err.to_string())?;

    Ok(client)
}

fn parse_date(date_text: &str) -> Result<Date, String> {
    let naive_date = NaiveDate::parse_from_str(date_text, "%Y-%m-%d")
        .map_err(|_| format!("Could not understand date: {}", date_text))?;

    Ok(Date::from(naive_date))
}

fn to_simple_lesson(lesson: &Lesson) -> SimpleLesson {
    let subject = match lesson.subjects.get(0) {
        Some(item) => item.name.clone(),
        None => String::new(),
    };

    let room = match lesson.rooms.get(0) {
        Some(item) => item.name.clone(),
        None => String::new(),
    };

    let teacher = match lesson.teachers.get(0) {
        Some(item) => item.name.clone(),
        None => String::new(),
    };

    let status = match lesson.code {
        LessonCode::Regular => "regular",
        LessonCode::Irregular => "irregular",
        LessonCode::Cancelled => "cancelled",
    };

    SimpleLesson {
        id: lesson.id,
        date: lesson.date.to_chrono().format("%Y-%m-%d").to_string(),
        start_time: lesson.start_time.to_chrono().format("%H:%M").to_string(),
        end_time: lesson.end_time.to_chrono().format("%H:%M").to_string(),
        subject,
        room,
        teacher,
        status: status.to_string(),
    }
}

#[tauri::command]
fn get_day_timetable(date: String) -> Result<Vec<SimpleLesson>, String> {
    let day = parse_date(&date)?;
    let mut client = login()?;

    let lessons = client
        .own_timetable_between(&day, &day)
        .map_err(|err| err.to_string())?;

    let mut simple_lessons = Vec::new();
    for lesson in &lessons {
        simple_lessons.push(to_simple_lesson(lesson));
    }

    Ok(simple_lessons)
}

#[tauri::command]
fn get_current_lesson() -> Result<Option<SimpleLesson>, String> {
    let today = Date::today();
    let mut client = login()?;

    let lessons = client
        .own_timetable_between(&today, &today)
        .map_err(|err| err.to_string())?;

    let now = chrono::Local::now().time();

    for lesson in &lessons {
        let start_time = lesson.start_time.to_chrono();
        let end_time = lesson.end_time.to_chrono();

        if now >= start_time && now <= end_time {
            return Ok(Some(to_simple_lesson(lesson)));
        }
    }

    // Nothing is happening right now.
    Ok(None)
}

#[tauri::command]
fn get_next_lesson_for_subject(subject: String) -> Result<Option<SimpleLesson>, String> {
    let mut client = login()?;
    let mut day = Date::from(Date::today().to_chrono() + Duration::days(1));

    for _ in 0..NEXT_LESSON_SEARCH_DAYS {
        let lessons = client
            .own_timetable_between(&day, &day)
            .map_err(|err| err.to_string())?;

        for lesson in &lessons {
            if let Some(first_subject) = lesson.subjects.get(0) {
                if first_subject.name == subject {
                    return Ok(Some(to_simple_lesson(lesson)));
                }
            }
        }

        day = Date::from(day.to_chrono() + Duration::days(1));
    }

    // No next lesson fount, so return None.
    Ok(None)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_day_timetable,
            get_current_lesson,
            get_next_lesson_for_subject
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}