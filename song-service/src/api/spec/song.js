import chai from 'chai';
import chaiHttp from 'chai-http';
import to from 'await-to-js';
import startService from '../../service';

const should = chai.should();
chai.use(chaiHttp);

describe('songs api', () => {
  describe('GET /songs', () => {
    it('responds with OK', async() => {
        const service = await startService(); 
        
        const [error, response] = await to(chai.request(service).get('/songs'));
        response.should.have.status(200);
        response.body.should.be.a('array');
      });
  });
});
