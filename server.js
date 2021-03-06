const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Mars Packer DB';

app.use(bodyParser.json());

const requireHTTPS = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
    next();
};

app.enable('trust proxy');

if (process.env.NODE_ENV === 'production') { app.use(requireHTTPS); }

app.use(express.static('public'))

app.get('/', (request, response) => {

});

// items endpoints
app.get('/api/v1/items', (request, response) => {
  database('items').select()
    .then((items) => {
      response.status(200).json(items);
    })
    .catch((error) => {
      response.status(500).json({ error })
    });
});

app.get('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;

  database('items').where('id', id).select()
    .then( item => {
      response.status(200).json(item)
    })
    .catch( error => {
      response.status(500).json({ error })
    })
})

app.post('/api/v1/items', (request, response) => {
  const itemInfo = request.body.item;
  const { name } = itemInfo;

  for (let requiredParam of ['name', 'packed']) {
    if (!itemInfo[requiredParam]) {
      return response
        .status(422)
        .send({ error: `You're missing a "${requiredParam}"`})
    }
  }

  database('items').insert(itemInfo, 'id')
    .then( itemId => {
      response.status(201).json({ name, packed: false, id: itemId[0] })
    })
    .catch( error => {
      response.status(500).json({ error: `Can only accept { name: <String>, packed: <Boolean> }` })
    })
})

app.delete('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;

  database('items').where('id', id).del()
    .then(deleted => {
      response.status(202).json({ numDeleted: deleted });
    })
    .catch( error => {
      response.status(500).json({ error });
    })
})

app.put('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;
  const itemInfo = request.body.item;

  database('items').where('id', id).update({...itemInfo})
    .then(() => {
      response.status(201).json({...itemInfo})
    })
    .catch(error => {
      response.status(500).json({ error: 'Can only accept name and packed as keys'})
    })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000.`)
});

module.exports = app;
