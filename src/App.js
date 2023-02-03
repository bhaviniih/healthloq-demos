import { BrowserRouter } from "react-router-dom";
import "./styles/global.scss";
import "./App.css";
import Main from "./Main";

function App() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default App;
