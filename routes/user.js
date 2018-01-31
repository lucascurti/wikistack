const express = require('express');
const userRouter = express.Router();
const models = require('../models');

const Page = models.Page;
const User = models.User;

userRouter.get('/:userId', (req, res, next) => {
  const userFind = User.findOne({
    where: {
      id: req.params.userId,
    },
  });
  const pagesFind = Page.findAll({
    where: {
      authorId: req.params.userId,
    },
  });

  Promise.all([userFind, pagesFind])
    .then(values => {
      const user = values[0];
      const pages = values[1];
      res.render('userpage', { user, pages });
    })
    .catch(next);
});

userRouter.get('/', (req, res, next) => {
  User.findAll()
    .then(users => res.render('users', { users }))
    .catch(next);
});

module.exports = userRouter;
