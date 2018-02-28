const ArrayToGoogleSheets = require('array-to-google-sheets');

function jsonToGssFormat(obj, rowName, prop, a1, sort) {

    // instantiating the set of the fields names
    let firstRowSet = new Set();

    // extracting the field names from the object
    obj.forEach(x => Object.keys(x[prop]).forEach(y => firstRowSet.add(y)));

    // converting the field names set into an array
    const a = Array.from(firstRowSet);

    // sorting it if the sort option was set to true
    let head = sort ? a.sort() : a;

    // assinging the value of the A1 field
    head.unshift(a1);

    // mapping the values into their corresponding rows
    const fillData = obj.map(x => head.map(y => y == a1 ? x[rowName] : x[prop][y] ? b(x[prop][y]) : false));


    return [head, ...fillData];
};

// check if input is array, stringify accordingly
function b(inp) {
    return inp instanceof Array ? inp.join(", ") : inp;
}

// catch and throw error
function er(cond, msg) {
    if (cond) throw new Error(msg);
};


// clean input out of invalid string charchters
function c(inp) {
    return typeof inp == 'string' ? inp.replace(/[\u0000-\u001f]/g,'') : inp;
}

module.exports = class {
    constructor(creds, docKey) {
        this.creds = creds;
        this.docKey = docKey;
    }
    push(docs, options) {
        const creds = this.creds;
        const docKey = this.docKey;
        return new Promise((resolve, reject) => {

            er(!(docs instanceof Array), "Wrong object schema provided, input must be an array of objects");

            const {sheetName, sort, removeBase} = options;

            er(!sheetName, "sheetName was not provided");

            // if rowName, properties or a1 field were not provided get them automatically
            const rowName = options.rowName || Object.keys(docs[0])[0];
            const properties = options.properties || Object.keys(docs[0])[1];
            const a1Field = options.a1Field || " ";

            let repData = jsonToGssFormat(docs, rowName, properties, a1Field, sort);

            // clean the data
            repData = repData.map(x => x.map(y => c(y)));

            // remove the base column if removeBase is set to true
            repData = removeBase ? repData.map(x => x.slice(1)) : repData;

            // push to the API
            const a2gs = new ArrayToGoogleSheets(this.docKey, this.creds);
            const a2gsOpts = {margin: 2, minRow: 10, minCol: 10, resize: true, clear: false};
            a2gs.updateGoogleSheets(sheetName, repData, a2gsOpts)
            .then(result => {
                resolve({
                    status: "Pushed to the spreadsheet"
                });
            })
            .catch(err => {
                reject(err);
            });
        }
    );}
};
