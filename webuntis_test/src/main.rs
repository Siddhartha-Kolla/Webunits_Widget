mod config;
use config::Config;

fn main() -> Result<(), untis::Error> {

  // Load enviroment variable from .env files (securely)
  let config = Config::from_env().expect("Failed to load configuration from .env file");

  let mut client = untis::Client::login(&config.school_server, &config.school_name, &config.server_username, &config.server_password)?;
  println!("Logged in");

  let timetable = client.own_timetable_for_week(&untis::Date::today())?;
  for lesson in timetable {
    println!("{:?}\n\n", lesson);
  }

  // profit

  Ok(())
}