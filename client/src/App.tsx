import { ThemeProvider } from "@/components/theme-provider";
import Home from "./pages/home";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Home socket={socket} />
    </ThemeProvider>
  );
}

export default App;
