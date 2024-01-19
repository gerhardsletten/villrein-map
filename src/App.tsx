import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const LefletMap = lazy(() => import("./containers/LefletMap/LefletMap"));

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="" Component={LefletMap} />
        <Route path=":year" Component={LefletMap} />
      </Routes>
    </div>
  );
}

export default App;
