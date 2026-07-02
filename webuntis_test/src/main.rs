fn main() -> Result<(), untis::Error> {
  let mut client = untis::Client::login("server.webuntis.com", "SchoolName", "username", "password")?;
  println!("Logged in");

  let timetable = client.own_timetable_for_week(&untis::Date::today())?;
  for lesson in timetable {
    println!("{:?}\n\n", lesson);
}

  // profit

  Ok(())
}