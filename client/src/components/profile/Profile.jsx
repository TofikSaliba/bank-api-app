import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { useData } from "../../contexts/DataContext";
import AccountCard from "../accountCard/AccountCard";
import API from "../../api/api";

import "./profile.css";

function Profile() {
  const [userAccounts, setUserAccounts] = useState([]);
  const [depositPopup, setDepositPopup] = useState(false);
  const [withdrawPopup, setWithdrawPopup] = useState(false);
  const [transferPopup, setTransferPopup] = useState(false);
  const [addAccountPopup, setAddAccountPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [proccessAmount, setProccessAmount] = useState("");
  const [accountID, setAccountID] = useState("");
  const [destinationID, setDestinationID] = useState("");
  const [cash, setCash] = useState("");
  const [credit, setCredit] = useState("");
  const [error, setError] = useState("");
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
          setCurrentUser(null);
          setToken(null);
          console.log(err);
        }
      };
      getUserAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAccount = (
    accID,
    amount,
    credit = 0,
    toAcc = "",
    second = false
  ) => {
    const newAccounts = userAccounts.map((acc) => {
      if (acc._id === accID) {
        acc.cash += amount;
      }
      return acc;
    });

    if (!currentUser.accounts.includes(toAcc) && second) {
      setCurrentUser({
        ...currentUser,
        cash: currentUser.cash + amount,
        credit: currentUser.credit + credit,
      });
      setUserAccounts(newAccounts);
    }
  };

  const handleAddAccount = async () => {
    try {
      const options = {
        headers: { Authorization: token },
      };
      const cash2 = Number(cash);
      const credit2 = Number(credit);
      const { data } = await API(options).post("/accounts/addAccount", {
        cash: cash2 ?? 0,
        credit: credit2 ?? 0,
      });
      const newUserAccounts = userAccounts.push(data.newAccount);
      setUserAccounts(newUserAccounts);
      updateAccount(accountID, cash2 ?? 0, credit2 ?? 0, "", true);
      setAddAccountPopup(false);
      setCash("");
      setCredit("");
      setError("");
    } catch (err) {
      setError(err.response.data.message || err.message);
      console.log(err);
    }
  };
  const handleDeleteAccount = async () => {
    try {
      const options = {
        headers: { Authorization: token },
      };
      const { data } = await API(options).delete(
        `/accounts/deleteAccount/${accountID}`
      );
      const newUserAccounts = userAccounts.filter((acc) => {
        return acc._id !== accountID;
      });

      updateAccount(
        "",
        -data.deletedAccount.cash,
        -data.deletedAccount.credit,
        "",
        true
      );
      setUserAccounts(newUserAccounts);
      setDeletePopup(false);
      setError("");
    } catch (err) {
      setError(err.response.data.message || err.message);
      console.log(err);
    }
  };

  const handleDeposit = async () => {
    if (!proccessAmount) {
      return setError("Must enter amount!");
    }
    try {
      const options = {
        headers: { Authorization: token },
      };
      const amount = Number(proccessAmount);
      await API(options).put("/accounts/deposit", {
        accountID: accountID,
        amount: amount,
      });
      updateAccount(accountID, amount, 0, "", true);
      setDepositPopup(false);
      setProccessAmount("");
      setError("");
    } catch (err) {
      setError(err.response.data.message);
      console.log(err);
    }
  };

  const handleWithdraw = async () => {
    if (!proccessAmount) {
      return setError("Must enter amount!");
    }
    try {
      const options = {
        headers: { Authorization: token },
      };
      const amount = Number(proccessAmount);
      await API(options).put("/accounts/withdraw", {
        accountID: accountID,
        amount: amount,
      });
      updateAccount(accountID, -amount, 0, "", true);
      setWithdrawPopup(false);
      setProccessAmount("");
      setError("");
    } catch (err) {
      setError(err.response.data.message);
      console.log(err);
    }
  };

  const handleTransfer = async () => {
    if (!proccessAmount || !destinationID) {
      return setError("Must enter amount and account ID!");
    }
    try {
      const options = {
        headers: { Authorization: token },
      };
      const amount = Number(proccessAmount);
      await API(options).put("/accounts/transfer", {
        fromAccountID: accountID,
        toAccountID: destinationID,
        amount: amount,
      });
      updateAccount(accountID, -amount, 0, destinationID, true);
      updateAccount(destinationID, amount, 0, destinationID);
      setTransferPopup(false);
      setProccessAmount("");
      setDestinationID("");
      setError("");
    } catch (err) {
      setError(err.response.data.message);
      console.log(err);
    }
  };

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
      return (
        <AccountCard key={account._id} account={account}>
          <span
            onClick={() => {
              setDeletePopup(true);
              setAccountID(account._id);
            }}
            className="deleteAccount"
          >
            ❌
          </span>
          <button
            onClick={() => {
              setAccountID(account._id);
              setDepositPopup(true);
            }}
          >
            Deposit
          </button>
          <button
            onClick={() => {
              setAccountID(account._id);
              setWithdrawPopup(true);
            }}
          >
            Withdraw
          </button>
          <button
            onClick={() => {
              setAccountID(account._id);
              setTransferPopup(true);
            }}
          >
            Transfer
          </button>
        </AccountCard>
      );
    });
  };

  if (!currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div className="profileContainer">
      {deletePopup && (
        <div className="popUp">
          <div className="addAccount">
            <h2>Are you sure you want to delete?</h2>
            <div className="transactionError">{error}</div>

            <button onClick={handleDeleteAccount}>Confirm</button>
            <button onClick={() => setDeletePopup(false)}>Cancel</button>
          </div>
        </div>
      )}
      {addAccountPopup && (
        <div className="popUp">
          <div className="addAccount">
            <h2>Enter details</h2>
            <div className="transactionError">{error}</div>
            <input
              placeholder="Cash (optional)"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              type="number"
            />
            <input
              placeholder="Credit (optional)"
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
              type="number"
            />
            <button onClick={handleAddAccount}>Confirm</button>
            <button
              onClick={() => {
                setAddAccountPopup(false);
                setCash("");
                setCredit("");
                setError("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {depositPopup && (
        <div className="popUp">
          <div className="deposit">
            <h2>Enter amount to deposit</h2>
            <div className="transactionError">{error}</div>
            <input
              placeholder="Amount"
              value={proccessAmount}
              onChange={(e) => setProccessAmount(e.target.value)}
              type="number"
            />
            <button onClick={handleDeposit}>Confirm</button>
            <button
              onClick={() => {
                setDepositPopup(false);
                setProccessAmount("");
                setError("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {withdrawPopup && (
        <div className="popUp">
          <div className="withdraw">
            <h2>Enter amount to withdraw</h2>
            <div className="transactionError">{error}</div>
            <input
              placeholder="Amount"
              value={proccessAmount}
              onChange={(e) => setProccessAmount(e.target.value)}
              type="number"
            />
            <button onClick={handleWithdraw}>Confirm</button>
            <button
              onClick={() => {
                setWithdrawPopup(false);
                setProccessAmount("");
                setError("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {transferPopup && (
        <div className="popUp">
          <div className="transfer">
            <h2>Enter amount to transfer and destination account</h2>
            <div className="transactionError">{error}</div>
            <input
              placeholder="Amount"
              value={proccessAmount}
              onChange={(e) => setProccessAmount(e.target.value)}
              type="number"
            />
            <input
              placeholder="Destination ID"
              value={destinationID}
              onChange={(e) => setDestinationID(e.target.value)}
              type="text"
            />
            <button onClick={handleTransfer}>Confirm</button>
            <button
              onClick={() => {
                setTransferPopup(false);
                setProccessAmount("");
                setDestinationID("");
                setError("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="userLeft">{getUserJSX()}</div>
      <div className="accountsRight">
        <h1>My Accounts</h1>
        <button
          onClick={() => setAddAccountPopup(true)}
          className="addAccountBtn"
        >
          Add Account
        </button>
        <div className="userAccounts">{getUserAccounts()}</div>
      </div>
    </div>
  );
}

export default Profile;
