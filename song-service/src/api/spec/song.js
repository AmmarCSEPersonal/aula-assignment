import chai from 'chai';
import chaiHttp from 'chai-http';
import to from 'await-to-js';
import startService from '../../service';

const should = chai.should();
chai.use(chaiHttp);

//in real world, we shouldnt be naive and we should actually handle
//other status codes such as 400+(authentication, not found if search term brings no results, etc)
//and gracefully handle 500s
describe('songs api', () => {
    describe('GET /songs', () => {
        it('responds with OK', async() => {
            const service = await startService(); 

            const [error, response] = await to(chai.request(service).get('/songs'));
            response.should.have.status(200);
            response.body.should.be.a('array');
        });
        it('responds with OK when search term included', async() => {
            const service = await startService(); 

            const [error, response] = await to(chai.request(service).get('/songs/Soothing'));
            response.should.have.status(200);
            response.body.should.be.a('array');
        });
    });
});
