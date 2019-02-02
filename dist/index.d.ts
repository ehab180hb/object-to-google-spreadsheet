export default class {
    private auth;
    /**
     * Instantiate an instance of the module
     * @param {object} creds - your Google's service account credentials.
     * @param {string} docKey - the ID of your spreadsheet.
     */
    constructor(creds: ServiceAccount, docKey: string);
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
    push(docs: object[], options?: PushOptions): Promise<{
        ok: boolean;
        rowCount: number;
    }>;
    private pushToSheet;
}
interface PushOptions {
    sheetName?: string;
    rowName?: string;
    properties?: string;
    a1Field?: string;
    sort?: boolean;
    removeBase?: boolean;
}
interface ServiceAccount {
    projectId?: string;
    clientEmail?: string;
    privateKey?: string;
}
export {};
