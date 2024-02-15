import Home from "./pages/home";

function App({ socket }: any) {
  return <Home socket={socket} />;
}

export default App;
