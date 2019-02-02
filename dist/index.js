"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayToGoogleSheets = require('array-to-google-sheets');
function jsonToGssFormat({ docs, rowName, properties, a1Field, sort }) {
    const firstRowSet = new Set();
    docs.forEach(inpObject => Object.keys(inpObject[properties]).forEach(keyName => firstRowSet.add(keyName)));
    let header = Array.from(firstRowSet);
    header = sort ? header.sort() : header;
    header.unshift(a1Field);
    const fillData = docs.map(inpObject => {
        return header.map(uniqueKey => {
            return uniqueKey == a1Field
                ? inpObject[rowName]
                : inpObject[properties][uniqueKey]
                    ? arrSringify(inpObject[properties][uniqueKey])
                    : false;
        });
    });
    return [header, ...fillData];
}
function arrSringify(input) {
    return Array.isArray(input) ? input.join(', ') : input;
}
function cleanChars(input) {
    return typeof input == 'string' ? input.replace(/[\u0000-\u001f]/g, '') : input;
}
class default_1 {
    /**
     * Instantiate an instance of the module
     * @param {object} creds - your Google's service account credentials.
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
    async push(docs, options = {}) {
        if (!Array.isArray(docs))
            throw new Error('Docs input must be an array');
        const { sheetName = 'New Sheet', rowName = Object.keys(docs[0])[0], properties = Object.keys(docs[0])[1], a1Field = ' ', sort, removeBase, } = options;
        let values = jsonToGssFormat({ docs, rowName, properties, a1Field, sort });
        values = values.map(x => x.map(y => cleanChars(y)));
        values = removeBase ? values.map(x => x.slice(1)) : values;
        return this.pushToSheet({ values, sheetName });
    }
    async pushToSheet(data) {
        const a2gs = new ArrayToGoogleSheets(this.auth.docKey, this.auth.creds);
        const options = { margin: 2, minRow: 10, minCol: 10, resize: true, clear: false };
        await a2gs.updateGoogleSheets(data.sheetName, data.values, options);
        return { ok: true, rowCount: data.values.length };
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map