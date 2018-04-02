const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(err => {
        throw err;
    });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/sad')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(err => {
        throw err;
    });
  });
});

describe('API Routes', () => {
  beforeEach((done) => {
    database.migrate.rollback()
    .then(() => {
      database.migrate.latest()
      .then(() => {
        return database.seed.run()
        .then(() => {
          done()
        })
      })
    })
  }) 

  describe('GET /api/v1/items', () => {
    it('should return all of the items', () => {
      return chai.request(server)
        .get('/api/v1/items')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Oxygen');
          response.body[0].should.have.property('packed');
          response.body[0].packed.should.equal(false);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
        })
        .catch(error => {
          throw error;
      });
    });
  })

  describe('POST /api/v1/items', () => {
    it('should create a new item', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          item: { name: 'Magazines', packed: 'false' }
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('name');
          response.body.name.should.equal('Magazines');
          response.body.should.have.property('packed');
          response.body.packed.should.equal(false);
          response.body.should.have.property('id');
          response.body.id.should.equal(4);
        })
        .catch(error => {
          throw error;
       });
    });

    it('should return an error if missing a required param', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          item: { name: 'Journal' }
        })
        .then(response => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal(`You're missing a "packed"`);
        })
        .catch(error => {
          throw error;
       });
    });

    it('should return an error if sent object has invalid value', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          item: { 
            name: 'Books',
            packed: 'false',
            fun: 'false'
          }
        })
        .then(response => {
          response.should.have.status(500);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
        })
        .catch(error => {
          throw error;
       });
    });
  })

  describe('DELETE /api/v1/items/:id', () => {
    it('should delete item associated with id', () => {
      return chai.request(server)
        .delete('/api/v1/items/2')
        .then(response => {
          response.should.have.status(202);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('numDeleted');
          response.body.numDeleted.should.equal(1);
        })
        .catch(error => {
          throw error;
        })
    })
  })

  describe('PUT /api/v1/items/:id', () => {
  
  })
})
