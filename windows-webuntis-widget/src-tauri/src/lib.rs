mod config;
use config::Config;
use chrono::Duration;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    let timetable: Vec<untis::Lesson> = get_timetable().expect("Failed to get timetable");
    // format!("Hello, {}! You've been greeted from Rust!", name)
    // convert timetable to json string and return it
    serde_json::to_string(&timetable).expect("Failed to convert timetable to JSON")
}

fn get_timetable() -> Result<Vec<untis::Lesson>, untis::Error> {
    // Load enviroment variable from .env files (securely)
    let config = Config::from_env().expect("Failed to load configuration from .env file");

    let mut client = untis::Client::login(
        &config.school_server,
        &config.school_name,
        &config.server_username,
        &config.server_password,
    )?;
    println!("Logged in");

    // compute a date one week (7 days) ago and request that week
    let last_week_date = untis::Date::from(untis::Date::today().to_chrono() - Duration::days(7));
    let timetable = client.own_timetable_for_week(&last_week_date)?;
    // for lesson in timetable {
    //     println!("{:?}\n\n", lesson);
    // }

    Ok(timetable)

}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}