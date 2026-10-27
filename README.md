# WebUntis Widget
A Windows 11 desktop widget for students and teachers that use the Webuntis time table service (popular in Germany and Austria). The Webuntis Widgets give students and teachers an overview of their classes, exams, timetables etc.

## Installation

### Option 1
Since it is a desktop app, there is no live link. Use a GitHub Releases download of the or installer. (Will be setup)

### Option 2
Clone the Github repository. Needs Node, Rust and the Tauri. Fill in the .env

SERVER_SCHOOL_SERVER=school.webuntis.com
SERVER_SCHOOL_NAME=school-name
SERVER_USERNAME=username
SERVER_PASSWORD=password


## Features
- Shows today's lessons, with the arrows at the top to move through days.
- Highlights the current lesson, and the next lesson of the same subject.
- A progress bar the shows how far through the school you are.
- A small frameless window that works as a desktop widget.

## Credits
Special thanks to Claude Code 😁 for helping me refactor my code, helping me improve the frontend and setting up the Github Actions workflow.
