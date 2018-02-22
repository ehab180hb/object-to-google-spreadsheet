const ArrayToGoogleSheets = require('array-to-google-sheets');

const jsonToGssFormat = (obj, rowName, prop, a1, sort) => {

    // instantiating the set of the fields names
    let firstRowSet = new Set();

    // a function the checks if input is array, stringifies accordingly
    const b = inp => inp instanceof Array ? inp.join(", ") : inp;

    // extracting the field names from the object
    obj.forEach(x => Object.keys(x[prop]).forEach(y => firstRowSet.add(y)));

    // converting the field names set into an array
    const a = Array.from(firstRowSet);

    // sorting it if the sort option was set to true
    let head = sort ? a.sort() : a;

    // // assinging the value of the A1 field
    head.unshift(a1);

    // mapping the values into their corresponding rows
    const fillData = obj.map(x => head.map(y => y == a1 ? x[rowName] : x[prop][y] ? b(x[prop][y]) : false));


    return [head, ...fillData];
};

module.exports = class {
    constructor(creds, docKey) {
        this.creds = creds;
        this.docKey = docKey;
    }
    push(docs, options) {
        const creds = this.creds;
        const docKey = this.docKey;
        return new Promise((resolve, reject) => {

            // a function that cleans input out of invalid string charchters
            const c = inp => typeof inp == 'string' ? inp.replace(/[\u0000-\u001f]/g,'') : inp;

            const {sheetName, sort, removeBase} = options;

            // if rowName, properties or a1 field were not provided get them automatically
            const rowName = options.rowName ? options.rowName : Object.keys(docs[0])[0];
            const properties = options.properties ? options.properties : Object.keys(docs[0])[1];
            const a1Field = options.a1Field ? options.a1Field : " ";

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
