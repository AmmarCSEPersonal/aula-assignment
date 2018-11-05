import chai from 'chai';
import to from 'await-to-js';
import User from '../user';

const expect = chai.expect;
describe('user', () => {
    it('should be invalid if username is empty', async() => {
        const user = new User();

        const [result] = await to(user.validate());
        expect(result.errors.username.kind).to.eql('required');
    });
});

