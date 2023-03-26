import { Navbar } from "./components";
import { useState, createContext } from "react";
import {
  Home,
  Branch,
  Reserve,
  Login,
  Signup,
  Welcome,
  Main,
  SettingRoom,
  SettingCo,
  SettingTime,
} from "./pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export const ContextUserId = createContext();

export const App = () => {
  const [userId, setUserId] = useState(8); //

  return (
    <BrowserRouter>
      <ContextUserId.Provider value={{ userId, setUserId }}>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/Login" element={<Login />} />
          <Route exact path="/branch/:branchId" element={<Branch />} />
          <Route exact path="/reserve/:branchId" element={<Reserve />} />
          <Route exact path="/:typeUser/signup" element={<Signup />} />
          <Route exact path="/partner/welcome" element={<Welcome />} />
          <Route exact path="/partner/main" element={<Main />} />
          <Route
            exact
            path="/partner/setting/coworkingspace"
            element={<SettingCo />}
          />
          <Route
            exact
            path="/partner/setting/rooms"
            element={<SettingRoom />}
          />
          <Route exact path="/partner/setting/time" element={<SettingTime />} />
        </Routes>
      </ContextUserId.Provider>
    </BrowserRouter>
  );
};
