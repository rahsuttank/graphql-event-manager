import "./App.css";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth/Auth";
import EventsPage from "./pages/Events/Events";
import BookingsPage from "./pages/Bookings/Bookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
