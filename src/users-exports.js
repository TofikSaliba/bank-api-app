import fs from "fs";

export const loadUsers = () => {
  try {
    const buffer = fs.readFileSync("src/jasonData/users.json");
    const json = buffer.toString();
    return JSON.parse(json);
  } catch (err) {
    return {};
  }
};

export const saveUsers = (users, key) => {
  const usersData = loadUsers();
  usersData[key] = users;
  const dataJSON = JSON.stringify(usersData);
  fs.writeFileSync("src/jasonData/users.json", dataJSON);
};

export const updateUsers = (account, key, cash = 0, credit = 0) => {
  const users = loadUsers()[key];
  const userObj = users.find((user) => {
    return user.passportID === account.owner;
  });
  userObj.cash += cash;
  userObj.credit += credit;
  if (!userObj.accounts.includes(account.accountID)) {
    userObj.accounts.push(account.accountID);
  }
  saveUsers(users, key);
};
