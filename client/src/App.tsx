import Home from "./pages/home";
// import io from "socket.io-client";

// const socket = io("http://localhost:3001");

function App({ socket }: any) {
  return <Home socket={socket} />;
}

export default App;
