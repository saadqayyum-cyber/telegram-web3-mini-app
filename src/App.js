import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header.js";
import MintBox from "./components/MintBox.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="Body" expand="lg">
          <Routes>
            <Route path="/" element={<MintBox />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
