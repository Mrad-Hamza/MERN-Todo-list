import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardManager from "./components/BoardManager";
import BoardSimpleUser from "./components/BoardSimpleUser";


import { logout } from "./slices/auth";

import EventBus from "./common/EventBus";

const App = () => {

  const [showSimpleUserBoard, setShowSimpleUserBoard] = useState(false);
  const [showManagerBoard, setShowManagerBoard] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();


  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setShowManagerBoard(currentUser.role.includes("Manager"));
      setShowSimpleUserBoard(currentUser.role.includes("Simple User"));
    } else {
      setShowManagerBoard(false);
      setShowSimpleUserBoard(false);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Todo-list App 
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {showManagerBoard && (
              <li className="nav-item">
                <Link to={"/manager"} className="nav-link">
                  Add To-do
                </Link>
              </li>
            )}

            {showSimpleUserBoard && (
              <li className="nav-item">
                <Link to={"/simpleuser"} className="nav-link">
                  Simple user Board
                </Link>
              </li>
            )} 
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.mailAddress}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Register
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route exact path='/profile' element={<Profile />} />
            <Route path="/manager" element={<BoardManager />} />
            <Route exact path='/simpleuser' element={<BoardSimpleUser />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
