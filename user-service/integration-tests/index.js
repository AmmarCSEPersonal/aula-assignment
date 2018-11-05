import chai from 'chai';
import chaiHttp from 'chai-http';
import to from 'await-to-js';
import startService from '../src/service';
import seedData from '../src/models/db/seeds/users.js';

const should = chai.should();
chai.use(chaiHttp);

describe('users api', () => {
    describe('GET /users', () => {
        it('responds with seeded data', async() => {
            const service = await startService(); 
            
            const [error, response] = await to(chai.request(service).get('/users'));
            response.should.have.status(200);
            response.body.should.be.a('array');
            response.body.should.be.eql(seedData);
        });
    });
});
