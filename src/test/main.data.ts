export const goodInputObjects = [
  {
    person: 'John',
    properties: {
      Age: 25,
      Address: '16 main st.',
    },
  },
  {
    person: 'Jane\u0000\u0000',
    properties: {
      Age: 26,
      Hobbies: ['swimming', 'Javascripting'],
    },
  },
]

export const options = {
  sheetName: 'My Awesome Report',
  rowName: 'person',
  properties: 'properties',
  a1Field: 'info',
}
