const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const router = require('./routes');
const models = require('./models');
// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// apuntá nunjucks al directorio conteniendo templates y apagando el cacheo,
// configure devuelve una instancia Enviornment que vamos a querer usar para
// agregar Markdown después.
var env = nunjucks.configure('views', { noCache: true });
// hace res.render funcionar con archivos html
app.set('view engine', 'html');
// cuando res.render funciona con archivos html, haz que use nunjucks para eso.
app.engine('html', nunjucks.render);

app.use(express.static('public'));

// Morgan for Logging
app.use(morgan('combined'));

// Routes
app.use('/', router);

// Start server
models.db
  .sync({ force: true })
  .then(() => app.listen(3000, () => console.log('Server started')))
  .catch(console.error);
