import chai from 'chai';
import to from 'await-to-js';
import Song from '../song';

const expect = chai.expect;
describe('song', () => {
    it('should be invalid if title or uri is empty', async() => {
        const song = new Song();

        const [result] = await to(song.validate());
        expect(result.errors.title.kind).to.eql('required');
        expect(result.errors.uri.kind).to.eql('required');
    });
    it('should be only allow valid enum type for genre or format', async() => {
        const song = new Song({genre: 'some invalid enum', format: 'some invalid enum'});

        const [result] = await to(song.validate());
        expect(result.errors.genre.kind).to.eql('enum');
        expect(result.errors.format.kind).to.eql('enum');
    });
});

