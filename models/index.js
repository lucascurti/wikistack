const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false,
});

const Page = db.define(
  'page',
  {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    urlTitle: {
      type: Sequelize.STRING,
      allowNull: false,
      get() {
        return `/wiki/${this.getDataValue('urlTitle')}`;
      },
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    tags: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
    status: {
      type: Sequelize.ENUM('open', 'closed'),
    },
    date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    hooks: {
      beforeValidate: (page, options) => {
        page.urlTitle = generateUrlTitle(page.title);
      },
    },
  },
);

Page.findByTag = function(tagsArray) {
  return Page.findAll({
    // $overlap machea un grupo de posibilidades
    where: {
      tags: {
        $overlap: tagsArray,
      },
    },
  });
};
const Op = Sequelize.Op;

Page.prototype.findSimilar = function() {
  console.log('entra');
  return Page.findAll({
    where: {
      tags: {
        $overlap: this.tags,
      },
      id: {
        $ne: this.id,
      },
    },
  });
};
const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
});

Page.belongsTo(User, { as: 'author' });

module.exports = {
  db,
  Page,
  User,
};

function generateUrlTitle(title) {
  if (title) {
    // Remueve todos los caracteres no-alfanuméricos
    // y hace a los espacios guiones bajos.
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generá de forma aleatoria un string de 5 caracteres
    return Math.random()
      .toString(36)
      .substring(2, 7);
  }
}
