// import { test } from '@japa/runner'
// import Database from '@ioc:Adonis/Lucid/Database'

// import UserFactory from 'Database/factories/UserFactory'
// import User from 'App/Models/User'

// import gnosisSafe from 'App/Helpers/gnosisSafe'
// import SafeFactory from 'Database/factories/SafeFactory'

// const safeAddress = '0x6C542DC64C338F4ECD88fc24975EdB8372169695'
// const walletAddress1 = '0xA3eCFc441A94b41EfF6E422E34E6c6BD5366353F'
// const walletAddress2 = '0xAdA63032d72511494719C7219069e04522F23326'

// test.group('Attach Wallet', (group) => {
//   group.each.setup(async () => {
//     await Database.beginGlobalTransaction()
//     return () => Database.rollbackGlobalTransaction()
//   })
//   test('Successfully attach wallet to an user without safe and address', async ({
//     client,
//     expect,
//   }) => {})
//   test('Successfully attach new wallet to an user having safe and address and remove from safe', async ({
//     client,
//     expect,
//   }) => {})
//   test('Throw an error when signed message is wrong', async ({ client, expect }) => {})
//   test('Throw an error when safe is not found', async ({ client, expect }) => {})
// })

// const getRandomString = async (user: User, client: any) => {
//   const response = await client.get('/wallet-random-string').loginAs(user)
//   return response.text() as string
// }
