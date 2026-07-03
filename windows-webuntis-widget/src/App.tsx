import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState([]);
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    let greetMsg = await invoke("greet", { name });
    // Covert greetmsg to a json list object and store it in greetMsg
    setGreetMsg(JSON.parse(greetMsg));
    console.log("greetMsg: ", greetMsg);
  }

  return (
    <main className="container">
      <h1>Webuntis Widget</h1>

      <div className="row">
        <a href="" target="_blank">
          <img src="https://www.untis.at/fileadmin/user_upload/Assets/logos/untis.svg" className="logo webuntis" alt="Webuntis logo" />
        </a>
      </div>
      <p>Click on the Webuntis logo to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      {/* <p>{greetMsg}</p> */}
      {greetMsg.length > 0 && <p>{greetMsg.map((lesson: any) => (
        <div key={lesson.id}>
          <p className="bold">{lesson.date}</p>
          <p>{lesson.substText}</p>
          {lesson.code == "Regular" &&
            <p>{lesson.su[0].name}</p>
          }
        </div>
      ))}</p>}
    </main>
  );
}

export default App;
