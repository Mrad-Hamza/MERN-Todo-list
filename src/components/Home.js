import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import UserService from "../services/user.service";

const Home = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const [content, setContent] = useState([]);



  useEffect(() => {
    console.log(isLoggedIn)
    UserService.getAllUsers().then(
      (response) => {
        setContent(response.data);
        console.log(response.data)
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);


  function UserGreeting() {
    return content.map(function (user, index) {
      const username = Object.values(user)[1] +" "+ Object.values(user)[2];
      const mailAddress = Object.values(user)[3];
      const role = Object.values(user)[5]
      const permission = Object.values(user)[6]
      return (
        <div>
          <h5>User name : {username}</h5>
          <ul> 
            <li>Mail Address : <b>{mailAddress}</b></li>
            <li>role = <b>{role}</b></li>
            <li>permission = <b>{permission}</b></li>
          </ul>
        </div> )
    });
  }

  function GuestGreeting() {
    return <h1>{content}, You Must Log In</h1>;
  }

  return (
    <div className="container">
      <h3>Users List : </h3>
      <header className="jumbotron">
        {isLoggedIn ? <UserGreeting /> : <GuestGreeting/>}
      </header>
    </div>
  );
};

export default Home;
