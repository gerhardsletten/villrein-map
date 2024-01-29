import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const AnimalMap = lazy(() => import("./containers/Map/AnimalMap"));

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="" Component={AnimalMap} />
        <Route path=":year" Component={AnimalMap} />
      </Routes>
    </div>
  );
}

export default App;
