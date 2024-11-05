import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import List from "./components/List/List";
import Detail from "./components/List/Detail";
import NavBar from "./components/NavBar/NavBar";

function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <Routes>
          {" "}
          {/* Wrap Route components with Routes */}
          <Route path="/" element={<List />} />{" "}
          {/* Use element instead of component */}
          <Route path="/detail/:id/" element={<Detail />} />{" "}
          {/* Use element instead of component */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
