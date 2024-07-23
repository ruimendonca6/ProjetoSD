import 'dotenv/config';
import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;
chai.use(chaiHttp);

const authServerUrl = 'http://localhost:18080'; // Authentication server
const blServerUrl = 'http://localhost:8080'; // Business logic server

describe('API Endpoints', () => {
  let token;
  let userId;
  let itemId;

  before((done) => {
    // Register a new user and get token from the authentication server
    chai.request(authServerUrl)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
        Admin: true
      })
      .end((err, res) => {
        expect(res).to.have.status(201);

        chai.request(authServerUrl)
          .post('/login')
          .send({
            username: 'testuser',
            password: 'testpassword'
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            token = res.body.token;
            done();
          });
      });
  });

  describe('User Management', () => {
    it('should get all users (GET /users)', (done) => {
      chai.request(authServerUrl)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('should create a new user (POST /register)', (done) => {
      chai.request(authServerUrl)
        .post('/register')
        .send({
          username: 'newuser',
          password: 'newpassword',
          View: true,
          Edit: false,
          Admin: false
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          done();
        });
    });

    it('should update an existing user (PUT /users/:id)', (done) => {
      // Fetch the user to get the ID
      chai.request(authServerUrl)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          const user = res.body.find(u => u.username === 'newuser');
          userId = user.id;

          chai.request(authServerUrl)
            .put(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              username: 'updateduser',
              password: 'updatedpassword',
              View: false,
              Edit: true,
              Admin: false
            })
            .end((err, res) => {
              expect(res).to.have.status(200);
              done();
            });
        });
    });

    it('should delete an existing user (DELETE /users/:id)', (done) => {
      chai.request(authServerUrl)
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('Item Management', () => {
    it('should get all items (GET /items)', (done) => {
      chai.request(blServerUrl)
        .get('/items')
        .end((err, res) => {
          if (err) {
            console.error('Error:', err);
          } else {
            console.log('Response:', res);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('should get a specific item (GET /items/:id)', (done) => {
      const itemId = 2; // Replace with an existing item ID
      chai.request(blServerUrl)
        .get(`/items/${itemId}`)
        .end((err, res) => {
          if (err) {
            console.error('Error:', err);
          } else {
            console.log('Response:', res);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('id').eql(itemId);
          done();
        });
    });

    it('should create a new item (POST /items)', (done) => {
      const newItem = { name: 'New Item', description: 'Description of the new item' };
      chai.request(blServerUrl)
        .post('/items')
        .send(newItem)
        .end((err, res) => {
          if (err) {
            console.error('Error:', err);
          } else {
            console.log('Response:', res);
          }
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('name').eql(newItem.name);
          done();
        });
    });

    it('should update an existing item (PUT /items/:id)', (done) => {
      const itemId = 2; // Replace with an existing item ID
      const updatedItem = { name: 'Updated Item', description: 'Updated description' };
      chai.request(blServerUrl)
        .put(`/items/${itemId}`)
        .send(updatedItem)
        .end((err, res) => {
          if (err) {
            console.error('Error:', err);
          } else {
            console.log('Response:', res);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('id').eql(itemId);
          expect(res.body).to.have.property('name').eql(updatedItem.name);
          done();
        });
    });

    it('should delete an item (DELETE /items/:id)', (done) => {
      const itemId = 2; // Replace with an existing item ID
      chai.request(blServerUrl)
        .delete(`/items/${itemId}`)
        .end((err, res) => {
          if (err) {
            console.error('Error:', err);
          } else {
            console.log('Response:', res);
          }
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  after((done) => {
    // Cleanup: Delete test user
    chai.request(authServerUrl)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        const user = res.body.find(u => u.username === 'testuser');
        const testUserId = user.id;

        chai.request(authServerUrl)
          .delete(`/users/${testUserId}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
  });
});
