import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;

chai.use(chaiHttp);

const serverUrl = 'http://localhost:8080'; // Ensure this is correct and the server is running

describe('API Endpoints', () => {
  it('should get all items (GET /items)', (done) => {
    chai.request(serverUrl)
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
    const itemId = 329; // Replace with an existing item ID
    chai.request(serverUrl)
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
    chai.request(serverUrl)
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
    const itemId = 329; // Replace with an existing item ID
    const updatedItem = { name: 'Updated Item', description: 'Updated description' };
    chai.request(serverUrl)
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
    const itemId = 329; // Replace with an existing item ID
    chai.request(serverUrl)
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
