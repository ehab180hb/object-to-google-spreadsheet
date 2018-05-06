const { expect } = require('chai');
const rewire = require('rewire');
const ObjectToGoogleSheet = rewire('../index');

describe('main module', ()=> {

	const fakeCreds = {};
	const fakeDocKey = '1gsLxL0ln8m2yJQgnLNpzvP8kGDLU1ATszwZlM';

	const goodInputObjects = [
		{
			person : 'John',
			properties : {
				Age: 25,
				Address : '16 main st.'
			}

		},
		{
			person : 'Jane',
			properties : {
				Age : 26,
				Hobbies : ['swimming', 'Javascripting']
			}

		}
	];

	this.badInputObjects = [
		'some string',
		{
			person : 'Jane \u0000 \u0000',
			properties : {
				Age : 26,
				Hobbies : ['swimming', 'Javascripting']
			}

		}
	];
	
	const options = {
		sheetName: 'My Awesome Report',
		rowName: 'person',
		properties: 'properties',
		a1Field: 'info',
		sort: true,
		removeBase: false
	};

	const fakePush = (auth, data) => {
		return {
			auth,
			data
		};
	};

	ObjectToGoogleSheet.__set__('pushToSheet', fakePush);

	before(async ()=> {
		const myModule = new ObjectToGoogleSheet(fakeCreds, fakeDocKey);
		this.goodResult = await myModule.push(goodInputObjects, options);
		this.myModule = myModule;
	});
	
	
	
	it('should process valid auth inputs', async () => {
		expect(this.goodResult).to.have.property('auth')
			.which.has.property('creds', fakeCreds);
		
		expect(this.goodResult).to.have.property('auth')
			.which.has.property('docKey', fakeDocKey);
	});
	
	it('should properly map the head', ()=> {
		expect(this.goodResult).to.have.property('data')
			.which.has.property('values')
			.that.is.an.instanceOf(Array)
			.with.lengthOf(3)
			.that.has.property([0])
			.which.has.property([3])
			.that.equals('Hobbies');
	});

	it('should properly map the body', ()=> {
		expect(this.goodResult).to.have.property('data')
			.which.has.property('values')
			.that.is.an.instanceOf(Array)
			.with.lengthOf(3)
			.that.has.property([1])
			.which.has.property([1])
			.that.equals('16 main st.');
	});

	it('should properly map array properties', ()=> {
		expect(this.goodResult).to.have.property('data')
			.which.has.property('values')
			.that.is.an.instanceOf(Array)
			.with.lengthOf(3)
			.that.has.property([2])
			.which.has.property([3])
			.that.equals('swimming, Javascripting');
	});

	it('should clean input out of invalid charcters', ()=> {
		expect(this.goodResult).to.have.property('data')
			.which.has.property('values')
			.that.is.an.instanceOf(Array)
			.with.lengthOf(3)
			.that.has.property([2])
			.which.has.property([0])
			.that.has.lengthOf(4);
	});

	it('should not process invalid input', ()=> {
		return this.myModule.push(this.badInputObjects, options)
			.catch((error) => {
				expect(error).to.be.instanceof(Error)
					.and.to.match(/must be an object/);
			});
		
	});

});
