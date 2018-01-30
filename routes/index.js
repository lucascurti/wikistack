const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const wikiRouter = require('./wiki');

router.use('/wiki', wikiRouter);
router.use('/user', userRouter);

router.get('/', (req, res) => {
  return res.render('index.html');
});

module.exports = router;
