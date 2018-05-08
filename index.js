const ArrayToGoogleSheets = require('array-to-google-sheets');
const Joi = require('joi');

const inputSchema = Joi.object().keys({
	docs: Joi.array().items(Joi.object()).required(),
	options: Joi.object().keys({
		sheetName: Joi.string(),
		rowName: Joi.string(),
		properties: Joi.string(),
		a1Field: [Joi.string(), Joi.number()],
		sort: Joi.boolean(),
		removeBase: Joi.boolean()
	}).optional(),
	auth: Joi.object().keys({
		creds: Joi.object().required(),
		docKey: Joi.string().required()
	}).required(),
}).required();

function jsonToGssFormat({ docs, rowName, properties, a1Field, sort }) {
	const firstRowSet = new Set();
	docs.forEach(inpObject => Object.keys(inpObject[properties])
		.forEach(keyName => firstRowSet.add(keyName)));

	let header = Array.from(firstRowSet);
	header = sort ? header.sort() : header;
	header.unshift(a1Field);

	const fillData = docs.map(inpObject => {
		return header.map(uniqueKey => {
			return uniqueKey == a1Field ? inpObject[rowName]
				: inpObject[properties][uniqueKey] ? arrSringify(inpObject[properties][uniqueKey])
					: false;
		});
	});

	return [header, ...fillData];
}

function arrSringify(input) {
	return input instanceof Array ? input.join(', ') : input;
}

function cleanChars(input) {
	return typeof input == 'string' ? input.replace(/[\u0000-\u001f]/g, '') : input;
}

function pushToSheet(auth, data) {
	return new Promise(async (resolve, reject) => {
		try {
			const a2gs = new ArrayToGoogleSheets(auth.docKey, auth.creds);
			const options = { margin: 2, minRow: 10, minCol: 10, resize: true, clear: false };
			await a2gs.updateGoogleSheets(data.sheetName, data.values, options);
			resolve({ ok: 1, rowCount: data.values.length });
		} catch (error) {
			reject({ error });
		}
	});
}


module.exports = class {
	/**
	 * Instantiate an instance of the module
	 * @param {object} creds - your Google's service account credintials.
	 * @param {string} docKey - the ID of your spreadsheet.
	 */
	constructor(creds, docKey) {
		this.auth = { creds, docKey };
	}
	/**
	 * Push your data to the sheet
	 * @param {array} docs - the array of your objects
	 * @param {object} options 
	 * @param {string} options.sheetName - the name of your sheet.
	 * @param {string} options.rowName - the key name of the field that will be used as an ID.
	 * @param {string} options.properties - the key name of the field containing the properties.
	 * @param {string} options.a1Field - the A1 spreadsheet cell.
	 * @param {boolean} options.removeBase - remove the set of IDs used to map the objects.
	 * @param {boolean} options.sort - sort chronologically.
	 * @returns {object} - confirmation of completion.
	 */
	push(docs, options = {}) {
		return new Promise(async (resolve, reject) => {
			try {
				const { auth } = this;
				const validation = Joi.validate({ docs, options, auth }, inputSchema);
				if (validation.error) throw new Error(validation.error);
				const {
					sheetName = 'New Sheet',
					rowName = Object.keys(docs[0])[0],
					properties = Object.keys(docs[0])[1],
					a1Field = ' ',
					sort,
					removeBase
				} = options;
				let values = jsonToGssFormat({ docs, rowName, properties, a1Field, sort });
				values = values.map(x => x.map(y => cleanChars(y)));
				values = removeBase ? values.map(x => x.slice(1)) : values;
				const result = await pushToSheet(auth, { values, sheetName });
				resolve(result);
			} catch (error) {
				reject(error);
			}
		}
		);
	}
};
