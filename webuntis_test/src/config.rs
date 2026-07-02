use dotenv::dotenv;
use std::env;

pub struct Config {
    pub school_server: String,
    pub school_name: String,
    pub server_username: String,
    pub server_password: String,
}

impl Config {
    pub fn from_env() -> Result<Self, String> {
        dotenv().ok(); // Load .env file

        Ok(Self {
            school_server: env::var("SERVER_SCHOOL_SERVER").map_err(|_| "SERVER_SCHOOL_SERVER is not set")?,
            school_name: env::var("SERVER_SCHOOL_NAME").map_err(|_| "SERVER_SCHOOL_NAME is not set")?,
            server_username: env::var("SERVER_USERNAME").map_err(|_| "SERVER_USERNAME is not set")?,
            server_password: env::var("SERVER_PASSWORD").map_err(|_| "SERVER_PASSWORD is not set")?,
        })
    }
}