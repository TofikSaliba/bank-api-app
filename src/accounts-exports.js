import fs from "fs";
import chalk from "chalk";
import uniqid from "uniqid";

import {
  loadUsers,
  saveUsers,
  createUser,
  updateUsers,
  getUser,
} from "./users-exports.js";

export const loadAccounts = () => {
  try {
    const buffer = fs.readFileSync("src/jasonData/accounts.json");
    const json = buffer.toString();
    return JSON.parse(json);
  } catch (err) {
    return {};
  }
};

export const saveAccounts = (accounts, key) => {
  const accountsData = loadAccounts();
  accountsData[key] = accounts;
  const dataJSON = JSON.stringify(accountsData);
  fs.writeFileSync("src/jasonData/accounts.json", dataJSON);
};

export const depositOrUpdateCredit = (accountID, amount, newCredit, key) => {
  try {
    const accounts = loadAccounts()[key];
    const account = accounts.find((account) => {
      return account.accountID === accountID;
    });
    if (!account) {
      throw new Error(`Account ID: ${accountID} does not exist!`);
    } else if (!account.isActive) {
      throw new Error(
        "Unauthorized, Account is not active! cannot do anything!"
      );
    } else {
      let creditDiff = 0;
      account.cash += amount;
      if (newCredit) {
        creditDiff = newCredit - account.credit;
        account.credit = newCredit;
      }
      updateUsers(account, key, amount, creditDiff);
      saveAccounts(accounts, key);
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export const withdraw = (passportID, accountID, amount, key) => {
  try {
    const accounts = loadAccounts()[key];
    const account = accounts.find((account) => {
      return account.accountID === accountID;
    });
    if (!account) {
      throw new Error(`Account ID: ${accountID} does not exist!`);
    } else if (!account.usersAccess.includes(passportID)) {
      throw new Error(
        "Unauthorized withdrawal, User ID has no access to this account!"
      );
    } else if (!account.isActive) {
      throw new Error(
        "Unauthorized, Account is not active! cannot do anything!"
      );
    } else if (account.credit + account.cash < amount) {
      throw new Error("Insufficient funds! amount not available.");
    } else {
      account.cash += -amount;
      updateUsers(account, key, -amount);
      saveAccounts(accounts, key);
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export const addAccessToAccount = (ownerID, accessID, accountID, key) => {
  try {
    const accounts = loadAccounts()[key];
    const account = accounts.find((account) => {
      return account.accountID === accountID;
    });
    if (!account) {
      throw new Error(`Account ID: ${accountID} does not exist!`);
    } else if (account.owner !== ownerID) {
      throw new Error(
        "Unauthorized, Only owner of the account can grant access to other users to it!"
      );
    } else if (!account.isActive) {
      throw new Error(
        "Unauthorized, Account is not active! cannot do anything!"
      );
    } else if (account.usersAccess.includes(accessID)) {
      throw new Error(
        `Passport ID: ${accessID} already has access to the account ${accountID}`
      );
    } else {
      const users = loadUsers()[key];
      const user = users.find((user) => {
        return user.passportID === accessID;
      });
      if (!user) {
        throw new Error(`Passport ID: ${accessID} does not exist!`);
      }
      user.accountsAccess.push(accountID);
      saveUsers(users, key);
      account.usersAccess.push(accessID);
      saveAccounts(accounts, key);
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export const removeAccessToAccount = (ownerID, accessID, accountID, key) => {
  try {
    const accounts = loadAccounts()[key];
    const account = accounts.find((account) => {
      return account.accountID === accountID;
    });
    if (!account) {
      throw new Error(`Account ID: ${accountID} does not exist!`);
    } else if (account.owner !== ownerID) {
      throw new Error(
        "Unauthorized, Only owner of the account can remove access of other users to it!"
      );
    } else if (!account.isActive) {
      throw new Error(
        "Unauthorized, Account is not active! cannot do anything!"
      );
    } else if (!account.usersAccess.includes(accessID)) {
      throw new Error(
        `Passport ID: ${accessID} already has no access to the account ${accountID}`
      );
    } else {
      const users = loadUsers()[key];
      const user = users.find((user) => {
        return user.passportID === accessID;
      });
      if (!user) {
        throw new Error(`Passport ID: ${accessID} does not exist!`);
      }
      user.accountsAccess = user.accountsAccess.filter((accID) => {
        return accID !== accountID;
      });
      saveUsers(users, key);
      account.usersAccess = account.usersAccess.filter((userID) => {
        return userID !== accessID;
      });
      saveAccounts(accounts, key);
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteAccount = (passportID, accountID, key) => {
  try {
    const accounts = loadAccounts()[key];
    const account = accounts.find((account) => {
      return account.accountID === accountID;
    });
    if (!account) {
      throw new Error(`Account ID: ${accountID} does not exist!`);
    } else if (account.owner !== passportID) {
      throw new Error("Unauthorized, Only owner of the account can delete it!");
    } else if (!account.isActive) {
      throw new Error(
        "Unauthorized, Account is not active! cannot do anything!"
      );
    } else {
      if (account.cash < 0) {
        throw new Error(
          `Cannot delete! first pay account dept of ${account.cash}`
        );
      }
      const users = loadUsers()[key];
      account.usersAccess.forEach((userID) => {
        const user = users.find((user) => {
          return user.passportID === userID;
        });
        user.accountsAccess = user.accountsAccess.filter((accID) => {
          return accID !== accountID;
        });
        if (user.passportID === account.owner) {
          user.accounts = user.accounts.filter((accID) => {
            return accID !== accountID;
          });
          user.credit -= account.credit;
          user.cash -= account.cash;
        }
      });
      const newAccounts = accounts.filter((acc) => {
        return acc.accountID !== accountID;
      });
      saveUsers(users, key);
      saveAccounts(newAccounts, key);
      return account.cash;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export const setAccActivity = (passportID, accountID, isActive, key) => {
  try {
    const accounts = loadAccounts()[key];
    const account = accounts.find((account) => {
      return account.accountID === accountID;
    });
    if (!account) {
      throw new Error(`Account ID: ${accountID} does not exist!`);
    } else if (account.owner !== passportID) {
      throw new Error(
        "Unauthorized, Only owner of the account can change activity!"
      );
    } else {
      account.isActive = isActive;
      saveAccounts(accounts, key);
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
