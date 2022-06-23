import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { usersRouter } from "./routes/users-routes.js";
import { accountsRouter } from "./routes/accounts-routes.js";
// import depRouter from "./routes/deposit.js";
// import updateCreditRouter from "./routes/updateCredit.js";
// import withdrawRouter from "./routes/withdraw.js";
// import transferRouter from "./routes/transfer.js";
// import getUserRouter from "./routes/getUser.js";
// import filterUsersRouter from "./routes/filterUsers.js";
// import addAccountRouter from "./routes/addAccount.js";
// import getAPIKeyRouter from "./routes/getAPIKey.js";
// import resetKeyRouter from "./routes/resetKey.js";
// import addAcessToAccountRouter from "./routes/grantAccess.js";
// import removeAccessToAccountRouter from "./routes/removeAccess.js";
// import deleteAccountRouter from "./routes/deleteAccount.js";
// import deleteUserRouter from "./routes/deleteUser.js";
// import setAccActivityRouter from "./routes/setAccActivity.js";
// import getAllDataRouter from "./routes/getAllData.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, "../client/build");

app.use(express.static(publicPath));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.use("/users", usersRouter);
app.use("/accounts", accountsRouter);
// app.use();

// if (process.env.NODE_ENV === "production") {}

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

export { app };
