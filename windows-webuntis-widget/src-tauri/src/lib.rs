// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    get_timetable().expect("Failed to get timetable");
    format!("Hello, {}! You've been greeted from Rust!", name)
}

///
/// This example shows how you can access a list of your school's teachers and how
/// you can view the timetables of other people/assets (i.e. rooms). Note that your
/// school likely has restrictions in place for accessing other timetables.
///

fn get_timetable() -> Result<(), untis::Error> {
    // Log in by specifying the school's details and credentials manually.
    let mut client =
        untis::Client::login("",
        "",
        "",
        ""
    )?;

    // Retrieve a list of teachers at the user's school.
    let teachers = client.teachers()?;

    for teacher in teachers {
        // Retrieve the teacher's timetable for the current week.
        let mut timetable =
            client.timetable_current_week(&teacher.id, &untis::ElementType::Teacher)?;

        timetable.sort_unstable_by_key(|lesson| (lesson.date, lesson.start_time));

        println!(
            "{} {}'s schedule this week:",
            teacher.first_name, teacher.last_name
        );

        for lesson in timetable {
            println!(
                "{}, {}-{}",
                weekday(lesson.date),
                *lesson.start_time,
                *lesson.end_time
            )
        }

        println!();
    }

    Ok(())
}

fn weekday(date: untis::Date) -> String {
    date.format("%A").to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}