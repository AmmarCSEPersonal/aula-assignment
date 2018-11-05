import chai from 'chai';
import to from 'await-to-js';
import Song from '../song';

const expect = chai.expect;
describe('song', () => {
    it('should be invalid if title or uri is empty', async() => {
        const song = new Song();

        const [result] = await to(song.validate());
        expect(result.errors.title).to.exist;
        expect(result.errors.uri).to.exist;
    });
});

