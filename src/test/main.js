const { expect } = require('chai');
const rewire = require('rewire');
const ObjectToGoogleSheet = rewire('../index');

let goodResult;
let goodResultNoOpts;
let goodResultWithSort;
let myModule;
let badInputObjects;

describe('main module', () => {

	const fakeCreds = {};
	const fakeDocKey = '1gsLxL0ln8m2yJQgnLNpzvP8kGDLU1ATszwZlM';

	const goodInputObjects = [
		{
			person: 'John',
			properties: {
				Age: 25,
				Address: '16 main st.'
			}
		},
		{
			person: 'Jane\u0000\u0000',
			properties: {
				Age: 26,
				Hobbies: ['swimming', 'Javascripting']
			}

		}
	];

	badInputObjects = [
		'some string',
		{
			person: 'Jane',
			properties: {
				Age: 26,
				Hobbies: ['swimming', 'Javascripting']
			}

		}
	];

	const options = {
		sheetName: 'My Awesome Report',
		rowName: 'person',
		properties: 'properties',
		a1Field: 'info'
	};

	const fakePush = (auth, data) => {
		return {
			auth,
			data
		};
	};

	ObjectToGoogleSheet.__set__('pushToSheet', fakePush);

	before(async () => {
		myModule = new ObjectToGoogleSheet(fakeCreds, fakeDocKey);
		[
			goodResult,
			goodResultNoOpts,
			goodResultWithSort
		] = await Promise.all(
			[
				myModule.push(goodInputObjects, options),
				myModule.push(goodInputObjects),
				myModule.push(goodInputObjects, { sort: true, removeBase: true })
			]
		);
	});



	it('should process valid auth inputs', async () => {
		expect(goodResult).to.have.property('auth')
			.which.has.property('creds', fakeCreds);

		expect(goodResult).to.have.property('auth')
			.which.has.property('docKey', fakeDocKey);
	});

	it('should properly map the head', () => {
		expect(goodResult).to.have.property('data')
			.which.has.property('values')
			.that.is.an.instanceOf(Array)
			.with.lengthOf(3)
			.that.has.property('0')
			.which.has.property('3')
			.that.equals('Hobbies');
	});

	it('should sort and remove base', () => {
		expect(goodResultWithSort).to.have.property('data')
			.which.has.property('values')
			.that.is.an.instanceOf(Array)
			.with.lengthOf(3)
			.that.has.property('0')
			.which.has.property('2')
			.that.equals('Hobbies');
	});

	it('should properly map the body', () => {
		expect(goodResult).to.have.property('data')
			.which.has.property('values')
			.that.is.an.instanceOf(Array)
			.with.lengthOf(3)
			.that.has.property('1')
			.which.has.property('1')
			.that.equals(25);
	});

	it('should figure out missing options', () => {
		expect(goodResultNoOpts).to.have.property('data')
			.which.has.property('values')
			.that.is.an.instanceOf(Array)
			.with.lengthOf(3)
			.that.has.property('1')
			.which.has.property('1')
			.that.equals(25);
	});

	it('should properly map array properties', () => {
		expect(goodResult).to.have.property('data')
			.which.has.property('values')
			.that.is.an.instanceOf(Array)
			.with.lengthOf(3)
			.that.has.property('2')
			.which.has.property('3')
			.that.equals('swimming, Javascripting');
	});

	it('should clean input out of invalid characters', () => {
		expect(goodResult).to.have.property('data')
			.which.has.property('values')
			.that.is.an.instanceOf(Array)
			.with.lengthOf(3)
			.that.has.property('2')
			.which.has.property('0')
			.that.has.lengthOf(4);
	});

	it('should not process invalid input', () => {
		return myModule.push(badInputObjects, options)
			.catch((error) => {
				expect(error).to.be.instanceof(Error)
					.and.to.match(/must be an object/);
			});

	});

});
