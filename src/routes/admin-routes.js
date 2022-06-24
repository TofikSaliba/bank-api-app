import express from "express";

import { auth } from "../middleware/auth.js";

import { getAllUsers } from "../controllers/admin.controllers.js";

const adminRouter = express.Router();

adminRouter.get("/getAllUsers", auth, getAllUsers);

// adminRouter.get("/updateCredit", function (req, res) {
//   try {
//     if (!checkAPIKey(req.query.apiKey)) {
//       res.status(404).json({ code: 404, message: "Wrong API key, Not found!" });
//     } else {
//       if (!req.body.newCredit || !req.body.accountID) {
//         throw new Error(
//           "Missing params! must provide accountID and newCredit to set."
//         );
//       } else if (req.body.newCredit < 0) {
//         throw new Error("newCredit must be a positive number!");
//       }
//       depositOrUpdateCredit(
//         req.body.accountID,
//         0,
//         req.body.newCredit,
//         req.query.apiKey
//       );
//       res.json({
//         message: "Success!",
//         newCredit: req.body.newCredit,
//         toAccountID: req.body.accountID,
//       });
//     }
//   } catch (err) {
//     res.status(400).json({ code: 400, message: err.message });
//   }
// });

// adminRouter.get("/filterUsers", function (req, res) {
//   try {
//     if (!checkAPIKey(req.query.apiKey)) {
//       res.status(404).json({ code: 404, message: "Wrong API key, Not found!" });
//     } else {
//       const users = loadUsers()[req.query.apiKey];
//       if (req.query.min !== undefined || req.query.max !== undefined) {
//         if (
//           (req.query.min !== undefined && isNaN(Number(req.query.min))) ||
//           (req.query.max !== undefined && isNaN(Number(req.query.max)))
//         ) {
//           throw new Error("Error! min and max query must be numbers!");
//         }
//         let filtered = users;
//         if (req.query.min !== undefined) {
//           filtered = filtered.filter((user) => {
//             return user.cash >= req.query.min;
//           });
//         }
//         if (req.query.max !== undefined) {
//           filtered = filtered.filter((user) => {
//             return user.cash <= req.query.max;
//           });
//         }
//         res.json(filtered);
//       } else {
//         res.json(users);
//       }
//     }
//   } catch (err) {
//     res.status(400).json({ code: 400, message: err.message });
//   }
// });

export { adminRouter };
