const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const wikiRouter = require('./wiki');

router.use('/wiki', wikiRouter);
router.use('/users', userRouter);

router.get('/', (req, res) => {
  return res.redirect('/wiki');
});

module.exports = router;
