const express = require('express');
const wikiRouter = express.Router();
const models = require('../models');

const Page = models.Page;
const User = models.User;

wikiRouter.get('/', (req, res, next) => {
  if (req.query.tags) {
    const tagsArray = req.query.tags.split(' ');
    Page.findByTag(tagsArray)
      .then(pages => res.render('index', { pages, tagsArray }))
      .catch(next);
  } else {
    Page.findAll()
      .then(pages => res.render('index', { pages }))
      .catch(next);
  }
});

wikiRouter.get('/similar/:pageId', (req, res, next) => {
  Page.findOne({
    where: {
      id: req.params.pageId,
    },
  })
    .then(page => {
      if (!page) {
        return res.status(404).send();
      } else {
        return page.findSimilar();
      }
    })
    .then(pages => {
      res.render('index', { pages });
    });
});

wikiRouter.post('/', (req, res, next) => {
  const tagsArray = req.body.tags.split(' ');
  const title = req.body.title;
  let urlTitle;
  User.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email,
    },
  })
    .then(values => {
      const user = values[0];
      // Update
      if (req.body.pageId) {
        Page.update(
          {
            title: req.body.title,
            tags: tagsArray,
            content: req.body.content,
            status: req.body.status,
            authorId: user.id,
          },
          {
            where: {
              id: req.body.pageId,
            },
            returning: true,
          },
        ).then(data => {
          const updatedPage = data[1][0];
          res.redirect(updatedPage.urlTitle);
        });
      } else {
        // Insert
        const page = Page.build({
          title,
          content: req.body.content,
          urlTitle,
          tags: tagsArray,
        });
        page
          .save()
          .then(newPage => {
            return newPage.setAuthor(user);
          })
          .then(page => res.redirect(page.urlTitle));
      }
    })

    .catch(next);
});

wikiRouter.get('/add', (req, res, next) => {
  const page = {
    title: '',
    urlTitle: '',
    content: '',
    tags: [],
  };
  return res.render('addpage', { page });
});

wikiRouter.get('/:urlTitle/delete/:pageId', (req, res, next) => {
  Page.destroy({
    where: {
      urlTitle: req.params.urlTitle,
      id: req.params.pageId,
    },
  }).then(answer => res.redirect('/'));
});

wikiRouter.get('/:urlTitle/edit/:pageId', (req, res, next) => {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle,
      id: req.params.pageId,
    },
    include: [{ model: User, as: 'author' }],
  }).then(page => res.render('addpage', { page }));
});

wikiRouter.get('/:urlTitle', (req, res, next) => {
  const pageFind = Page.findOne({
    where: {
      urlTitle: req.params.urlTitle,
    },
    include: [{ model: User, as: 'author' }],
  }).then(page => {
    if (!page) {
      res.status(404).send();
    } else {
      res.render('wikipage', { page });
    }
  });
});

module.exports = wikiRouter;
