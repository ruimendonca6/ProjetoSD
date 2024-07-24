import * as dotenv from 'dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';

dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);

const authServerUrl = 'http://localhost:18080';
const blServerUrl = 'http://localhost:8080'; 

describe('API Endpoints', () => {
  let token;
  let userId;
  let itemId;

  before((done) => {
    chai.request(authServerUrl)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
        Admin: true
      })
      .end((err, res) => {
        if (err) {
          console.error('Registration error:', err);
          done(err);
        } else {
          console.log('Registration response:', res.body);
          try {
            expect(res).to.have.status(201);

            chai.request(authServerUrl)
              .post('/login')
              .send({
                username: 'testuser',
                password: 'testpassword'
              })
              .end((err, res) => {
                if (err) {
                  console.error('Login error:', err);
                  done(err);
                } else {
                  console.log('Login response:', res.body);
                  expect(res).to.have.status(200);
                  token = res.body.token;
                  done();
                }
              });
          } catch (e) {
            console.error('Assertion error:', e);
            done(e);
          }
        }
      });
  });

  describe('User Management', () => {
    it('should get all users (GET /users)', (done) => {
      chai.request(authServerUrl)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) {
            console.error('Get users error:', err);
            done(err);
          } else {
            console.log('Get users response:', res.body);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
          }
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
          if (err) {
            console.error('Create user error:', err);
            done(err);
          } else {
            console.log('Create user response:', res.body);
            expect(res).to.have.status(201);
            done();
          }
        });
    });

    it('should update an existing user (PUT /users/:id)', (done) => {
      chai.request(authServerUrl)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) {
            console.error('Fetch user error:', err);
            done(err);
          } else {
            console.log('Fetch user response:', res.body);
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
                if (err) {
                  console.error('Update user error:', err);
                  done(err);
                } else {
                  console.log('Update user response:', res.body);
                  expect(res).to.have.status(200);
                  done();
                }
              });
          }
        });
    });

    it('should delete an existing user (DELETE /users/:id)', (done) => {
      chai.request(authServerUrl)
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) {
            console.error('Delete user error:', err);
            done(err);
          } else {
            console.log('Delete user response:', res.body);
            expect(res).to.have.status(200);
            done();
          }
        });
    });
  });

  describe('Historical Events', () => {
    it('should get all historical events (GET /items)', (done) => {
      chai.request(blServerUrl)
        .get('/items')
        .end((err, res) => {
          if (err) {
            console.error('Get items error:', err);
            done(err);
          } else {
            console.log('Get items response:', res.body);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
          }
        });
    });

    it('should get a specific historical event (GET /items/:id)', (done) => {
      const itemId = 2; 
      chai.request(blServerUrl)
        .get(`/items/${itemId}`)
        .end((err, res) => {
          if (err) {
            console.error('Get item error:', err);
            done(err);
          } else {
            console.log('Get item response:', res.body);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('id').eql(itemId);
            done();
          }
        });
    });

    it('should create a new historical event (POST /items)', (done) => {
      const newItem = {
        id: 10125,
        date: "22-07-2024",
        description: "Acontecimento Histórico",
        lang: "pt",
        category1: "By place",
        category2: "Viana",
        granularity: "year",
        createdAt: "2024-07-07T21:28:11.690Z",
        updatedAt: "2024-07-07T21:28:11.690Z"
      };
      chai.request(blServerUrl)
        .post('/items')
        .send(newItem)
        .end((err, res) => {
          if (err) {
            console.error('Create item error:', err);
            done(err);
          } else {
            console.log('Create item response:', res.body);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('id');
            done();
          }
        });
    });

    it('should update an existing historical event (PUT /items/:id)', (done) => {
      const itemId = 10125; 
      const updatedItem = {
        id: itemId,
        date: "10-12-2000",
        description: "Updated description of the historical event.",
        lang: "pt",
        category1: "By place",
        category2: "Portugal",
        granularity: "year",
        createdAt: "2024-07-07T21:28:11.690Z",
        updatedAt: "2024-07-07T21:28:11.690Z"
      };
      chai.request(blServerUrl)
        .put(`/items/${itemId}`)
        .send(updatedItem)
        .end((err, res) => {
          if (err) {
            console.error('Update item error:', err);
            done(err);
          } else {
            console.log('Update item response:', res.body);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('id').eql(itemId);
            done();
          }
        });
    });

    it('should delete a historical event (DELETE /items/:id)', (done) => {
      const itemId = 10125; 
      chai.request(blServerUrl)
        .delete(`/items/${itemId}`)
        .end((err, res) => {
          if (err) {
            console.error('Delete item error:', err);
            done(err);
          } else {
            console.log('Delete item response:', res.body);
            expect(res).to.have.status(200);
            done();
          }
        });
    });
  });

  after((done) => {
    chai.request(authServerUrl)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          console.error('Fetch test user error:', err);
          done(err);
        } else {
          console.log('Fetch test user response:', res.body);
          expect(res).to.have.status(200);
          const user = res.body.find(u => u.username === 'testuser');
          const testUserId = user ? user.id : null;

          if (testUserId) {
            chai.request(authServerUrl)
              .delete(`/users/${testUserId}`)
              .set('Authorization', `Bearer ${token}`)
              .end((err, res) => {
                if (err) {
                  console.error('Delete test user error:', err);
                  done(err);
                } else {
                  console.log('Delete test user response:', res.body);
                  expect(res).to.have.status(200);
                  done();
                }
              });
          } else {
            done();
          }
        }
      });
  });
});
