import { BrowserRouter, Routes, Route } from "react-router-dom";
import Readings from "./components/Readings";
import Admin from "./components/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Readings />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}