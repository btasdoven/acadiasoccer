import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import PrivateRoute from "./layout/PrivateRoute";
import UnsignedRoute from "./layout/UnsignedRoute";
import AppLayout from "./layout/AppLayout";

// import Login from "./pages/Login";
import LoginWithPhone from "./pages/LoginWithPhone";
// import SignUp from "./pages/Signup";
import Profile from "./pages/Profile";
import AllPlayers from "./pages/AllPlayers";
import Games from "./pages/Games";
import GameDetails from "./pages/GameDetails";
import ForgetPassword from "./pages/ForgetPassword";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <div className="app-mh-100">
      <Router>
        <Routes>
          {/* <Route exact path="/signup" element={<UnsignedRoute><SignUp /></UnsignedRoute>} /> */}
          <Route exact path="/login" element={<UnsignedRoute><LoginWithPhone /></UnsignedRoute>} />
          <Route exact path="/forget-password" element={<UnsignedRoute><ForgetPassword /></UnsignedRoute>} />

          <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
            <Route path="" element={<Navigate to="/games" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="allplayers" element={<AllPlayers />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="games" element={<Games />} />
            <Route path="games/:cid" element={<GameDetails />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
