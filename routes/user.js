const express = require('express');
const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  return res.render('index.html');
});

module.exports = userRouter;
