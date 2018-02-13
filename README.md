Quickly publish a set of unstructured JSON objects into a Google spreadsheet that you specifiy.

# Installation

[![NPM Info](https://nodei.co/npm/object-to-google-spreadsheet.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.org/package/object-to-google-spreadsheet)


## Example usage

```
const OTJS = require('./index');

// require your Google json credentials file
const creds = require('./creds');

const myReport = new OTJS(creds, '<your spreadsheet ID here>');

const options = {
    repName: 'My Awesome Report', // sheet name
    rowName: 'Person', // the key name of the base of your rows
    properties: 'Properties', // the name of the array of objects containing your base's properties
    a1Field: 'details', // the value of the A1 field
    sort: true // sort fields
}

const docs = [
    {
        "Person" : "John",
        "Properties" : [
            {
                "Age" : "25",
                "Address" : "16 main st."
            }
        ]
    },
    {
        "Person" : "Jane",
        "Properties" : [
            {
                "Age" : "26",
                "Hobbies" : "swimming"
            }
        ]
    }
]

// push your object to the sheet
myReport.push(docs, options)

```

## Example result

![updated sheet](https://i.imgur.com/CiWu1SX.png)


# docKey

- Every Google Sheets has a unique key in the URL
- https://docs.google.com/spreadsheets/d/{docKey}/

# Creds

1. Go to the Google [Developers Console](https://console.developers.google.com/cloud-resource-manager)
2. Select or Create Project
3. Dashboard > Enable APIs and Services > Enable the Drive API for your project
4. Credentials > Create Service Account Key
5. Select Json Key type and save the downloaded json file to your project
6. Once you have created the services account, you will have an email xxx@xxx.iam.gserviceaccount.com. **Go to your Google Sheets file and shared the edit permission to the email address.**
2. For more details, please refer to https://www.npmjs.com/package/google-spreadsheet

# Links
- https://developers.google.com/google-apps/spreadsheets/
- https://www.npmjs.com/package/google-spreadsheet
- https://www.npmjs.com/package/array-to-google-sheets


## Author

[Ehab Khaireldin](https://github.com/ehab180hb)


## License

This project is licensed under the MIT License and built for OneMeter.com
