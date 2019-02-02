const ArrayToGoogleSheets = require('array-to-google-sheets')

function jsonToGssFormat({ docs, rowName, properties, a1Field, sort }: JsonToGssFormatInput) {
  const firstRowSet = new Set()

  docs.forEach(inpObject => Object.keys(inpObject[properties]).forEach(keyName => firstRowSet.add(keyName)))

  let header = Array.from(firstRowSet)
  header = sort ? header.sort() : header
  header.unshift(a1Field)

  const fillData = docs.map(inpObject => {
    return header.map(uniqueKey => {
      return uniqueKey == a1Field
        ? inpObject[rowName]
        : inpObject[properties][uniqueKey]
        ? arrSringify(inpObject[properties][uniqueKey])
        : false
    })
  })

  return [header, ...fillData]
}

function arrSringify(input: any): any {
  return Array.isArray(input) ? input.join(', ') : input
}

function cleanChars(input: any): any {
  return typeof input == 'string' ? input.replace(/[\u0000-\u001f]/g, '') : input
}

export default class {
  private auth: { creds: ServiceAccount; docKey: string }
  /**
   * Instantiate an instance of the module
   * @param {object} creds - your Google's service account credentials.
   * @param {string} docKey - the ID of your spreadsheet.
   */
  constructor(creds: ServiceAccount, docKey: string) {
    this.auth = { creds, docKey }
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
  async push(docs: object[], options: PushOptions = {}): Promise<{ ok: boolean; rowCount: number }> {
    if (!Array.isArray(docs)) throw new Error('Docs input must be an array')

    const {
      sheetName = 'New Sheet',
      rowName = Object.keys(docs[0])[0],
      properties = Object.keys(docs[0])[1],
      a1Field = ' ',
      sort,
      removeBase,
    } = options

    let values = jsonToGssFormat({ docs, rowName, properties, a1Field, sort })
    values = values.map(x => x.map(y => cleanChars(y)))
    values = removeBase ? values.map(x => x.slice(1)) : values

    return this.pushToSheet({ values, sheetName })
  }

  private async pushToSheet(data: { values: any[]; sheetName: string }): Promise<{ ok: boolean; rowCount: number }> {
    const a2gs = new ArrayToGoogleSheets(this.auth.docKey, this.auth.creds)
    const options = { margin: 2, minRow: 10, minCol: 10, resize: true, clear: false }
    await a2gs.updateGoogleSheets(data.sheetName, data.values, options)
    return { ok: true, rowCount: data.values.length }
  }
}

interface PushOptions {
  sheetName?: string
  rowName?: string
  properties?: string
  a1Field?: string
  sort?: boolean
  removeBase?: boolean
}

interface ServiceAccount {
  projectId?: string
  clientEmail?: string
  privateKey?: string
}

interface JsonToGssFormatInput {
  docs: object[]
  rowName: string
  properties: string
  a1Field: string
  sort?: boolean
}
