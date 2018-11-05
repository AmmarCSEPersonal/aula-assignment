import chai from 'chai';
import chaiHttp from 'chai-http';
import to from 'await-to-js';
import startService from '../src/service';
import seedData from '../src/models/db/seeds/songs.js';

const should = chai.should();
chai.use(chaiHttp);

describe('songs api', () => {
    describe('GET /songs', () => {
        it('responds with seeded data', async() => {
            const service = await startService(); 
            
            const [error, response] = await to(chai.request(service).get('/songs'));
            response.should.have.status(200);
            response.body.should.be.a('array');
            response.body.should.be.eql(seedData);
        });
        it('responds with filtered seeded data when genre passed in', async() => {
            const service = await startService(); 
            
            const [error, response] = await to(chai.request(service).get('/songs/Soothing'));
            response.should.have.status(200);
            response.body.should.be.a('array');
            response.body.should.be.eql(seedData.filter(seed => seed.genre == 'Soothing'));
        });
    });
});
