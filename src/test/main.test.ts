import ObjectToGoogleSheet from '../index'
import { goodInputObjects, options } from './main.data'

const fakeCreds = {}
const fakeDocKey = '1gsLxL0ln8m2yJQgnLNpzvP8kGDLU1ATszwZlM'

const report = new ObjectToGoogleSheet(fakeCreds, fakeDocKey)

let result
Object.defineProperty(report, 'pushToSheet', { value: data => (result = data) })

describe('main module', () => {
  test('When optional data are given', async () => {
    await report.push(goodInputObjects, options)
    expect(result).toMatchSnapshot()
  })

  test('When optional data are not given', async () => {
    await report.push(goodInputObjects)
    expect(result).toMatchSnapshot()
  })

  test('When sorting and removing base', async () => {
    await report.push(goodInputObjects, { sort: true, removeBase: true })
    expect(result).toMatchSnapshot()
  })

  test('Auth data are passed correctly', () => {
    expect(Object.getOwnPropertyDescriptor(report, 'auth')).toMatchSnapshot()
  })

  test('Throws when given invalid input', async () => {
    // @ts-ignore
    await expect(report.push({})).rejects.toThrowErrorMatchingSnapshot()
  })
})
