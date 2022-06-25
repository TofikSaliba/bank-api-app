import React from "react";
import { Redirect } from "react-router-dom";

import { useData } from "../../contexts/DataContext";

function Profile() {
  const { currentUser, setCurrentUser, setToken } = useData();

  if (!currentUser) {
    return <Redirect to="/" />;
  }

  return <div>Profile</div>;
}

export default Profile;
