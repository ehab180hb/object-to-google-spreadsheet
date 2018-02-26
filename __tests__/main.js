const expect = require('chai').expect;
const rewire = require('rewire');
const O2GS = rewire('../index');

describe('main module', ()=> {

    const inputObject = [
        {
            person : "John",
            properties : {
                Age: 25,
                Address : "16 main st."
            }

        },
        {
            person : "Jane",
            properties : {
                Age : 26,
                Hobbies : ["swimming", "Javascripting"]
            }

        }
    ];

    const jsonToGssFormat = O2GS.__get__('jsonToGssFormat');
    const c = O2GS.__get__('c');
    const b = O2GS.__get__('b');

    it('should return return an equal number of inputs and outputs', () => {
        expect(jsonToGssFormat(inputObject, 'person', 'properties', ' ').length).to.equal(3);
    });

    it('should map correctly when not sorted', ()=> {
        expect(jsonToGssFormat(inputObject, 'person', 'properties', ' ')[1][1]).to.equal(25);
    });

    it('should map correctly when sorted', ()=> {
        expect(jsonToGssFormat(inputObject, 'person', 'properties', ' ', true)[1][1]).to.equal('16 main st.');
    });

    it('should correctly assign the A1 field', ()=> {
        expect(jsonToGssFormat(inputObject, 'person', 'properties', 'details', true)[0][0]).to.equal('details');
    })

    it('should clean output out of invalid charchters', ()=> {
        expect(c('Hello \u0000 \u0002').length).to.equal(7);
    });

});
