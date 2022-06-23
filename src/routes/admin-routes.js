import express from "express";

const adminRouter = express.Router();

adminRouter.get("/getAllData");

adminRouter.get("/filterUsers", function (req, res) {
  try {
    if (!checkAPIKey(req.query.apiKey)) {
      res.status(404).json({ code: 404, message: "Wrong API key, Not found!" });
    } else {
      const users = loadUsers()[req.query.apiKey];
      if (req.query.min !== undefined || req.query.max !== undefined) {
        if (
          (req.query.min !== undefined && isNaN(Number(req.query.min))) ||
          (req.query.max !== undefined && isNaN(Number(req.query.max)))
        ) {
          throw new Error("Error! min and max query must be numbers!");
        }
        let filtered = users;
        if (req.query.min !== undefined) {
          filtered = filtered.filter((user) => {
            return user.cash >= req.query.min;
          });
        }
        if (req.query.max !== undefined) {
          filtered = filtered.filter((user) => {
            return user.cash <= req.query.max;
          });
        }
        res.json(filtered);
      } else {
        res.json(users);
      }
    }
  } catch (err) {
    res.status(400).json({ code: 400, message: err.message });
  }
});

export { adminRouter };
