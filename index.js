const ArrayToGoogleSheets = require('array-to-google-sheets');

const jsonToGssFormat = (obj, rowName, properties, a1Field, sort) => {

    // instantiating the set of the fields names
    let firstRowSet = new Set([]);

    // extracting the field names from the object
    [obj.forEach(x => x[properties].forEach( y => {
        Object.keys(y).forEach(key => firstRowSet.add(key));
    }))];

    // converting the field names set into an array
    const a = Array.from(firstRowSet);

    // sorting it if the sort option was set to true
    let firstRowArray = sort ? a.sort() : a;

    // // assinging the value of the A1 field
    firstRowArray.unshift(a1Field);

    // mapping the values into their corresponding rows
    const fillData = obj.map(x => {
        const singleRowPrint = [];
        firstRowArray.forEach(availableKey => {
            x[properties].forEach(set =>  {
                const val = availableKey == a1Field ? x[rowName] : set[availableKey] ? set[availableKey] : false;
                singleRowPrint.push(val)
            });
        });
        return singleRowPrint;
    })
    return [firstRowArray, ...fillData];
}

module.exports = class {
    constructor(creds, docKey) {
        this.creds = creds;
        this.docKey = docKey;
    }
    push(docs, options) {
        const creds = this.creds
        const docKey = this.docKey
        return new Promise((resolve, reject) => {
            const {repName, rowName, properties, a1Field, sort} = options;
            const repData = jsonToGssFormat(docs, rowName, properties, a1Field, sort);
            const a2gs = new ArrayToGoogleSheets(this.docKey, this.creds);
            const a2gsOpts = {margin: 2, minRow: 10, minCol: 10, resize: true, clear: false}
            a2gs.updateGoogleSheets(repName, repData, a2gsOpts).then(result => resolve(result))
        }
    )}
}
