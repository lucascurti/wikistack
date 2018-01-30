const express = require('express');
const wikiRouter = express.Router();
const models = require('../models');

const Page = models.Page;
const User = models.User;

wikiRouter.get('/', (req, res, next) => {
  res.redirect('/');
});

wikiRouter.post('/', (req, res, next) => {
  // res.send(req.body);
  const title = req.body.title;
  let urlTitle;
  const page = Page.build({
    title,
    content: req.body.content,
    urlTitle
  });

  page.save().then(() => res.redirect('/'));
});

wikiRouter.get('/add', (req, res, next) => {
  return res.render('addpage');
});

module.exports = wikiRouter;
