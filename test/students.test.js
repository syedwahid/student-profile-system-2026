const { expect } = require('chai');
const { isValidEmail } = require('../students');

describe('isValidEmail', () => {
    it('accepts a normal, well-formed address', () => {
        expect(isValidEmail('john@school.com')).to.be.true;
    });

    it('accepts addresses with subdomains and plus-addressing', () => {
        expect(isValidEmail('jane.doe+test@mail.school.co.uk')).to.be.true;
    });

    it('rejects a string with no @', () => {
        expect(isValidEmail('invalid-email')).to.be.false;
    });

    it('rejects a string with no domain after @', () => {
        expect(isValidEmail('missing-domain@')).to.be.false;
    });

    it('rejects a string with spaces in it', () => {
        expect(isValidEmail('bad email@school.com')).to.be.false;
    });
});
