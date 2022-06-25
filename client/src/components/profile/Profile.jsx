import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { useData } from "../../contexts/DataContext";
import AccountCard from "../accountCard/AccountCard";
import API from "../../api/api";

import "./profile.css";

function Profile() {
  const [userAccounts, setUserAccounts] = useState([]);
  const { currentUser, setCurrentUser, setToken, token } = useData();

  useEffect(() => {
    if (currentUser) {
      const getUserAccounts = async () => {
        try {
          const options = {
            headers: { Authorization: token },
          };
          const { data } = await API(options).get("/accounts/ownAccounts");
          setUserAccounts(data.accounts);
        } catch (err) {
          console.log(err);
        }
      };
      getUserAccounts();
    }
  }, []);

  const getUserJSX = () => {
    return (
      <>
        <div>
          <span>User ID:</span> {currentUser._id}
        </div>
        <div>
          <span>Name:</span> {currentUser.name}
        </div>
        <div>
          <span>Email:</span> {currentUser.email}
        </div>
        <div>
          <span>PassportID:</span> {currentUser.passportID}
        </div>
        <div>
          <span>Cash:</span> {currentUser.cash}
        </div>
        <div>
          <span>Credit:</span> {currentUser.credit}
        </div>
      </>
    );
  };

  const getUserAccounts = () => {
    return userAccounts.map((account) => {
      return <AccountCard account={account} />;
    });
  };

  if (!currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div className="profileContainer">
      <div className="userLeft">{getUserJSX()}</div>
      <div className="accountsRight">
        <h1>My Accounts</h1>
        <div className="userAccounts">{getUserAccounts()}</div>
      </div>
    </div>
  );
}

export default Profile;
