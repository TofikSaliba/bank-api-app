import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import Profile from "./components/profile/Profile";
import Login from "./components/login/Login";
import Register from "./components/register/Register";

import { useData } from "./contexts/DataContext";

import API from "./api/api.js";
import "./app.css";

function App() {
  const { setCurrentUser, setToken } = useData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = JSON.parse(localStorage.getItem("bankToken"));
    if (storedToken) {
      const getUser = async () => {
        try {
          const options = {
            headers: { Authorization: storedToken },
          };
          const { data } = await API(options).get("/users/profile");
          setCurrentUser(data.requestedUser);
          setToken(storedToken);
        } catch (err) {
          console.log(err.message);
        }
      };
      getUser();
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Router>
        <Header />
        <div className="mainContainer">
          {loading && <h1>Loading</h1>}
          {!loading && (
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/Login" component={Login} />
              <Route exact path="/Register" component={Register} />
            </Switch>
          )}
        </div>
      </Router>
    </>
  );
}

export default App;
