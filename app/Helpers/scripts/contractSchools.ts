import { DateTime } from 'luxon'

import { ContractStatus } from 'App/Helpers/constants'
import Contract from 'App/Models/Contract'
import School from 'App/Models/School'
import Draft from 'App/Models/Draft'
import Isp from 'App/Models/Isp'
import Lta from 'App/Models/Lta'

type GenerateMetric = (
  schoolId: number,
  metricsId: number[],
  contractId: number,
  values: number[]
) => {
  metricId: number
  value: number
  schoolId: number
  contractId: number
}[]

export const createContracts = async (
  ltas: Lta[],
  isps: Isp[],
  countryId: number,
  otherCountryId: number,
  currencyId: number,
  frequencyId: number,
  budget: string,
  createdBy: number,
  metricsId: number[]
) => {
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: true,
    ltaId: ltas[0].id,
    name: '8412140',
    status: ContractStatus.Ongoing,
    startDate: DateTime.now().set({ day: 10, month: 5, year: 2022 }),
    endDate: DateTime.now().set({ day: 20, month: 8, year: 2022 }),
    ispId: isps[2].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [92, 30, 10, 10]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Ramón Rosa',
          countryId,
          '1807003088',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [92, 30, 10, 10]
        ),
        await createSchool(
          'Instituto Oficial Satuye',
          countryId,
          '18070031501',
          'Rio de Janeiro',
          'Rio de Janeiro',
          'Rua Herena',
          '268',
          metricsId,
          ctc.id,
          generateMetric,
          [92, 30, 10, 10]
        ),
        await createSchool(
          'La Libertad',
          countryId,
          '18070032201',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [92, 20, 5, 10]
        ),
        await createSchool(
          'Medardo Mejía',
          countryId,
          '18070032924',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [0, 0, 0, 0]
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: true,
    ltaId: ltas[0].id,
    name: '8412141',
    status: ContractStatus.Completed,
    startDate: DateTime.now().set({ day: 9, month: 3, year: 2021 }),
    endDate: DateTime.now().set({ day: 6, month: 9, year: 2021 }),
    ispId: isps[2].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [100, 100, 30, 50]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'David Hércules Navarro',
          countryId,
          '1807003089',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [100, 100, 30, 50]
        ),
        await createSchool(
          'Rafael Pineda Ponce',
          countryId,
          '18070031502',
          'Rio de Janeiro',
          'Rio de Janeiro',
          'Rua Herena',
          '268',
          metricsId,
          ctc.id,
          generateMetric,
          [100, 100, 30, 50]
        ),
        await createSchool(
          'Marlon Lara Orellana',
          countryId,
          '18070032202',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [100, 100, 30, 50]
        ),
        await createSchool(
          'Francisco Varela',
          countryId,
          '18070032925',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [100, 100, 30, 50]
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: true,
    ltaId: ltas[0].id,
    name: '8412142',
    status: ContractStatus.Completed,
    startDate: DateTime.now().set({ day: 11, month: 3, year: 2020 }),
    endDate: DateTime.now().set({ day: 13, month: 10, year: 2020 }),
    ispId: isps[2].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [95, 200, 10, 20]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Andrés Abelino Martínez',
          countryId,
          '180700364',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [95, 200, 10, 20]
        ),
      ])
  })
  await Draft.firstOrCreate({
    name: '7287573',
    countryId: countryId,
    governmentBehalf: false,
    ltaId: ltas[1].id,
    startDate: DateTime.now().set({ day: 11, month: 9, year: 2022 }),
    endDate: DateTime.now().set({ day: 30, month: 3, year: 2023 }),
    ispId: isps[7].id,
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: false,
    ltaId: ltas[1].id,
    name: '7287574',
    status: ContractStatus.Completed,
    startDate: DateTime.now().set({ day: 1, month: 3, year: 2021 }),
    endDate: DateTime.now().set({ day: 30, month: 9, year: 2021 }),
    ispId: isps[7].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [96, 50, 30, 50]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Adelina Martínez Ávila',
          countryId,
          '180700371',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [96, 50, 30, 50]
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: false,
    ltaId: ltas[1].id,
    name: '7287575',
    status: ContractStatus.Completed,
    startDate: DateTime.now().set({ day: 2, month: 3, year: 2020 }),
    endDate: DateTime.now().set({ day: 23, month: 10, year: 2020 }),
    ispId: isps[7].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [92, 100, 10, 20]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Miguel Rafael Madrid',
          countryId,
          '18070030800',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [92, 100, 10, 20]
        ),
        await createSchool(
          'Pedro Nufio',
          countryId,
          '18070031503',
          'Rio de Janeiro',
          'Rio de Janeiro',
          'Rua Herena',
          '268',
          metricsId,
          ctc.id,
          generateMetric,
          [92, 100, 10, 20]
        ),
        await createSchool(
          'Hercules Elementary',
          countryId,
          '18070032203',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [92, 100, 10, 20]
        ),
        await createSchool(
          'Whale Gulch High School',
          countryId,
          '18070032926',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [92, 80, 10, 5]
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: false,
    ltaId: ltas[1].id,
    name: '7287576',
    status: ContractStatus.Completed,
    startDate: DateTime.now().set({ day: 25, month: 10, year: 2019 }),
    endDate: DateTime.now().set({ day: 10, month: 7, year: 2020 }),
    ispId: isps[7].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [92, 100, 10, 20]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Northview School for Girls',
          countryId,
          '18070030801',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [92, 100, 10, 20]
        ),
        await createSchool(
          'Pleasant Valley Conservatory',
          countryId,
          '18070031504',
          'Rio de Janeiro',
          'Rio de Janeiro',
          'Rua Herena',
          '268',
          metricsId,
          ctc.id,
          generateMetric,
          [92, 100, 10, 20]
        ),
        await createSchool(
          'Panorama High',
          countryId,
          '18070032204',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [92, 100, 10, 20]
        ),
        await createSchool(
          'Sandalwood School',
          countryId,
          '18070032927',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [92, 100, 10, 20]
        ),
        await createSchool(
          'Riverview School',
          countryId,
          '18070032928',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [92, 80, 5, 20]
        ),
      ])
  })
  await Draft.firstOrCreate({
    name: '8818229',
    countryId: countryId,
    governmentBehalf: false,
    startDate: DateTime.now().set({ day: 30, month: 9, year: 2022 }),
    endDate: DateTime.now().set({ day: 20, month: 4, year: 2023 }),
    ispId: isps[6].id,
  })
  await Draft.firstOrCreate({
    name: '9393487',
    countryId: countryId,
    governmentBehalf: true,
    startDate: DateTime.now().set({ day: 16, month: 11, year: 2022 }),
    endDate: DateTime.now().set({ day: 24, month: 5, year: 2023 }),
    ispId: isps[3].id,
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: false,
    name: '4949780',
    status: ContractStatus.Sent,
    startDate: DateTime.now().set({ day: 13, month: 11, year: 2022 }),
    endDate: DateTime.now().set({ day: 12, month: 7, year: 2023 }),
    ispId: isps[1].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [92, 100, 10, 20]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Green Valley Grammar School',
          countryId,
          '18070037132',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: false,
    name: '5079401',
    status: ContractStatus.Confirmed,
    startDate: DateTime.now().set({ day: 16, month: 11, year: 2022 }),
    endDate: DateTime.now().set({ day: 5, month: 7, year: 2023 }),
    ispId: isps[1].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [92, 100, 10, 20]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Green Valley School for Boys',
          countryId,
          '180700448',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: false,
    name: '6934334',
    status: ContractStatus.Ongoing,
    startDate: DateTime.now().set({ day: 13, month: 4, year: 2022 }),
    endDate: DateTime.now().set({ day: 20, month: 8, year: 2022 }),
    ispId: isps[9].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [100, 100, 30, 50]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Northview School for Girls',
          countryId,
          '18070030802',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [100, 100, 30, 50]
        ),
        await createSchool(
          'Pleasant Valley Conservatory',
          countryId,
          '18070031505',
          'Rio de Janeiro',
          'Rio de Janeiro',
          'Rua Herena',
          '268',
          metricsId,
          ctc.id,
          generateMetric,
          [5, 5, 5, 5]
        ),
        await createSchool(
          'Panorama High',
          countryId,
          '18070032205',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [100, 4, 30, 4]
        ),
        await createSchool(
          'Sandalwood School',
          countryId,
          '18070032929',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [90, 100, 10, 50]
        ),
        await createSchool(
          'Seacoast Elementary',
          countryId,
          '18070032930',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [0, 0, 0, 0]
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: true,
    name: '9020161',
    status: ContractStatus.Ongoing,
    startDate: DateTime.now().set({ day: 9, month: 4, year: 2022 }),
    endDate: DateTime.now().set({ day: 10, month: 11, year: 2022 }),
    ispId: isps[10].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [62, 50, 10, 10]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Northview School for Girls',
          countryId,
          '18070030803',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [62, 50, 10, 10]
        ),
        await createSchool(
          'Pleasant Valley Conservatory',
          countryId,
          '18070031506',
          'Rio de Janeiro',
          'Rio de Janeiro',
          'Rua Herena',
          '268',
          metricsId,
          ctc.id,
          generateMetric,
          [62, 4, 4, 4]
        ),
        await createSchool(
          'Panorama High',
          countryId,
          '18070032206',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [0, 0, 0, 0]
        ),
        await createSchool(
          'Sandalwood School',
          countryId,
          '18070032931',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [0, 0, 0, 0]
        ),
        await createSchool(
          'Seacoast Elementary',
          countryId,
          '18070032932',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [0, 0, 0, 0]
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: false,
    name: '5631506',
    status: ContractStatus.Ongoing,
    startDate: DateTime.now().set({ day: 15, month: 6, year: 2022 }),
    endDate: DateTime.now().set({ day: 12, month: 10, year: 2022 }),
    ispId: isps[5].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [96, 30, 30, 50]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Northview School for Girls',
          countryId,
          '18070030804',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [96, 30, 30, 50]
        ),
        await createSchool(
          'Pleasant Valley Conservatory',
          countryId,
          '18070031507',
          'Rio de Janeiro',
          'Rio de Janeiro',
          'Rua Herena',
          '268',
          metricsId,
          ctc.id,
          generateMetric,
          [96, 30, 30, 50]
        ),
        await createSchool(
          'Panorama High',
          countryId,
          '18070032207',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [96, 30, 30, 50]
        ),
        await createSchool(
          'Sandalwood School',
          countryId,
          '18070032910',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [96, 5, 10, 5]
        ),
        await createSchool(
          'Seacoast Elementary',
          countryId,
          '18070032911',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [0, 0, 0, 0]
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: false,
    name: '2526207',
    status: ContractStatus.Ongoing,
    startDate: DateTime.now().set({ day: 1, month: 10, year: 2022 }),
    endDate: DateTime.now().set({ day: 18, month: 1, year: 2023 }),
    ispId: isps[1].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [82, 100, 10, 20]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Northview School for Girls',
          countryId,
          '18070030805',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [82, 100, 10, 20]
        ),
        await createSchool(
          'Pleasant Valley Conservatory',
          countryId,
          '18070031508',
          'Rio de Janeiro',
          'Rio de Janeiro',
          'Rua Herena',
          '268',
          metricsId,
          ctc.id,
          generateMetric,
          [82, 2, 2, 2]
        ),
        await createSchool(
          'Panorama High',
          countryId,
          '18070032208',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [0, 0, 0, 0]
        ),
        await createSchool(
          'Sandalwood School',
          countryId,
          '18070032912',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [0, 0, 0, 0]
        ),
        await createSchool(
          'Seacoast Elementary',
          countryId,
          '18070032913',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [0, 0, 0, 0]
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: true,
    name: '2154531',
    status: ContractStatus.Expired,
    startDate: DateTime.now().set({ day: 16, month: 12, year: 2021 }),
    endDate: DateTime.now().set({ day: 1, month: 7, year: 2022 }),
    ispId: isps[4].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [80, 200, 10, 10]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Northview School for Girls',
          countryId,
          '18070030806',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [80, 200, 10, 10]
        ),
        await createSchool(
          'Pleasant Valley Conservatory',
          countryId,
          '18070031509',
          'Rio de Janeiro',
          'Rio de Janeiro',
          'Rua Herena',
          '268',
          metricsId,
          ctc.id,
          generateMetric,
          [80, 200, 10, 10]
        ),
        await createSchool(
          'Panorama High',
          countryId,
          '18070032209',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [80, 200, 10, 10]
        ),
        await createSchool(
          'Sandalwood School',
          countryId,
          '18070032914',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [80, 200, 10, 10]
        ),
        await createSchool(
          'Seacoast Elementary',
          countryId,
          '18070032915',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [0, 0, 0, 0]
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: false,
    name: '6483012',
    status: ContractStatus.Expired,
    startDate: DateTime.now().set({ day: 31, month: 12, year: 2021 }),
    endDate: DateTime.now().set({ day: 14, month: 3, year: 2022 }),
    ispId: isps[8].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [96, 200, 10, 10]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Northview School for Girls',
          countryId,
          '18070030807',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [96, 200, 10, 10]
        ),
        await createSchool(
          'Pleasant Valley Conservatory',
          countryId,
          '18070031510',
          'Rio de Janeiro',
          'Rio de Janeiro',
          'Rua Herena',
          '268',
          metricsId,
          ctc.id,
          generateMetric,
          [96, 200, 10, 10]
        ),
        await createSchool(
          'Panorama High',
          countryId,
          '18070032210',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [96, 200, 10, 10]
        ),
        await createSchool(
          'Sandalwood School',
          countryId,
          '18070032916',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [96, 200, 10, 10]
        ),
        await createSchool(
          'Seacoast Elementary',
          countryId,
          '18070032917',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [96, 2, 10, 2]
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: true,
    name: '2364146',
    status: ContractStatus.Completed,
    startDate: DateTime.now().set({ day: 4, month: 4, year: 2021 }),
    endDate: DateTime.now().set({ day: 6, month: 9, year: 2021 }),
    ispId: isps[7].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [100, 30, 30, 50]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Northview School for Girls',
          countryId,
          '18070030808',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [100, 30, 30, 50]
        ),
        await createSchool(
          'Pleasant Valley Conservatory',
          countryId,
          '18070031511',
          'Rio de Janeiro',
          'Rio de Janeiro',
          'Rua Herena',
          '268',
          metricsId,
          ctc.id,
          generateMetric,
          [100, 30, 30, 50]
        ),
        await createSchool(
          'Panorama High',
          countryId,
          '18070032211',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [100, 30, 30, 50]
        ),
        await createSchool(
          'Sandalwood School',
          countryId,
          '18070032918',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [100, 30, 30, 50]
        ),
        await createSchool(
          'Seacoast Elementary',
          countryId,
          '18070032919',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [100, 30, 30, 50]
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: true,
    name: '1089794',
    status: ContractStatus.Completed,
    startDate: DateTime.now().set({ day: 27, month: 3, year: 2020 }),
    endDate: DateTime.now().set({ day: 13, month: 10, year: 2020 }),
    ispId: isps[10].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [96, 100, 20, 50]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Northview School for Girls',
          countryId,
          '18070030809',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [96, 100, 20, 50]
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: false,
    name: '5804450',
    status: ContractStatus.Completed,
    startDate: DateTime.now().set({ day: 22, month: 4, year: 2021 }),
    endDate: DateTime.now().set({ day: 30, month: 7, year: 2021 }),
    ispId: isps[11].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [94, 30, 10, 30]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Northview School for Girls',
          countryId,
          '18070030810',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [94, 30, 10, 30]
        ),
        await createSchool(
          'Pleasant Valley Conservatory',
          countryId,
          '18070031512',
          'Rio de Janeiro',
          'Rio de Janeiro',
          'Rua Herena',
          '268',
          metricsId,
          ctc.id,
          generateMetric,
          [94, 30, 10, 30]
        ),
        await createSchool(
          'Panorama High',
          countryId,
          '18070032212',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [94, 30, 10, 30]
        ),
        await createSchool(
          'Sandalwood School',
          countryId,
          '18070032920',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [94, 30, 10, 30]
        ),
        await createSchool(
          'Seacoast Elementary',
          countryId,
          '18070032921',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [94, 1, 1, 30]
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: false,
    name: '5950765',
    status: ContractStatus.Completed,
    startDate: DateTime.now().set({ day: 7, month: 3, year: 2020 }),
    endDate: DateTime.now().set({ day: 23, month: 10, year: 2020 }),
    ispId: isps[3].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [100, 30, 20, 50]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Northview School for Girls',
          countryId,
          '18070030811',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [100, 30, 20, 50]
        ),
        await createSchool(
          'Pleasant Valley Conservatory',
          countryId,
          '18070031513',
          'Rio de Janeiro',
          'Rio de Janeiro',
          'Rua Herena',
          '268',
          metricsId,
          ctc.id,
          generateMetric,
          [100, 30, 20, 50]
        ),
        await createSchool(
          'Panorama High',
          countryId,
          '18070032213',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [100, 30, 20, 50]
        ),
        await createSchool(
          'Sandalwood School',
          countryId,
          '18070032922',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [100, 30, 20, 50]
        ),
        await createSchool(
          'Seacoast Elementary',
          countryId,
          '18070032923',
          'Goiás',
          'Goiás',
          'Rua VM B 7',
          '840',
          metricsId,
          ctc.id,
          generateMetric,
          [100, 5, 5, 50]
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: countryId,
    governmentBehalf: false,
    name: '3625312',
    status: ContractStatus.Completed,
    startDate: DateTime.now().set({ day: 2, month: 1, year: 2020 }),
    endDate: DateTime.now().set({ day: 10, month: 7, year: 2020 }),
    ispId: isps[0].id,
    currencyId,
    frequencyId,
    budget,
    createdBy,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [98, 100, 10, 10]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Northview School for Girls',
          countryId,
          '18070030812',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [98, 100, 10, 10]
        ),
      ])
  })
  await Contract.firstOrCreate({
    countryId: otherCountryId,
    governmentBehalf: true,
    name: '9655154',
    currencyId: currencyId,
    budget: '2000000',
    frequencyId: frequencyId,
    startDate: DateTime.now(),
    endDate: DateTime.now(),
    ispId: isps[17].id,
    createdBy: createdBy,
    status: ContractStatus.Ongoing,
    ltaId: ltas[3].id,
  }).then(async (ctc) => {
    await ctc
      .related('expectedMetrics')
      .createMany(generateExpectedMetrics(ctc.id, metricsId, [98, 100, 10, 10]))
    await ctc
      .related('schools')
      .saveMany([
        await createSchool(
          'Northview School for Girls',
          otherCountryId,
          '180700308129',
          'São Paulo',
          'Itapevi',
          'Rua Eulália',
          '1245',
          metricsId,
          ctc.id,
          generateMetric,
          [98, 100, 10, 10]
        ),
      ])
  })
  await Draft.firstOrCreate({
    countryId: otherCountryId,
    governmentBehalf: true,
    name: '9114097',
    currencyId: currencyId,
    frequencyId: frequencyId,
    createdBy: createdBy,
  })
}

export const createIsps = (countryId: number, otherCountryId: number) => {
  return Isp.createMany([
    {
      name: 'Anylink',
      countryId: countryId,
    },
    {
      name: 'AT&T Brazil',
      countryId: countryId,
    },
    {
      name: 'Brisanet Telecommunications',
      countryId: countryId,
    },
    {
      name: 'Claro Brazil',
      countryId: countryId,
    },
    {
      name: 'iO',
      countryId: countryId,
    },
    {
      name: 'Skymax Brazil', // 5
      countryId: countryId,
    },
    {
      name: 'Starlink SpaceX',
      countryId: countryId,
    },
    {
      name: 'T-Mobile Brazil',
      countryId: countryId,
    },
    {
      name: 'TIM',
      countryId: countryId,
    },
    {
      name: 'Verzion Communications', // 9
      countryId: countryId,
    },
    {
      name: 'Vivo',
      countryId: countryId,
    },
    {
      name: 'Vodafone',
      countryId: countryId,
    },
    // Botswana
    {
      name: 'Reliance JIO',
      countryId: otherCountryId,
    },
    {
      name: 'KDDI',
      countryId: otherCountryId,
    },
    {
      name: 'AT&T Botswana',
      countryId: otherCountryId,
    },
    {
      name: 'Claro Botswana',
      countryId: otherCountryId,
    },
    {
      name: 'Skymax Botswana',
      countryId: otherCountryId,
    },
    {
      name: 'T-Mobile Botswana',
      countryId: otherCountryId,
    },
  ])
}

export const createLtas = (countryId: number, otherCountryId: number) => {
  return Lta.createMany([
    {
      countryId: countryId,
      name: 'LLTS-42416339',
    },
    {
      countryId: countryId,
      name: 'LLTS-62428355',
    },
    {
      countryId: countryId,
      name: 'LLTS-18070030',
    },
    {
      countryId: otherCountryId,
      name: 'LLTS-45685455',
    },
  ])
}

const generateExpectedMetrics = (contractId: number, metricsId: number[], values: number[]) => {
  return [
    {
      metricId: metricsId[0],
      value: values[0],
      contractId,
    },
    {
      metricId: metricsId[1],
      value: values[1],
      contractId,
    },
    {
      metricId: metricsId[2],
      value: values[2],
      contractId,
    },
    {
      metricId: metricsId[3],
      value: values[3],
      contractId,
    },
  ]
}

const generateSchool = (
  name: string,
  countryId: number,
  externalId: string,
  location1: string,
  location2: string,
  location3: string,
  location4: string
) => ({
  name,
  externalId,
  address: `${location1}, ${location2}, ${location3}, ${location4},`,
  location1,
  location2,
  location3,
  location4,
  educationLevel: 'High school',
  geopoint: '10.32424, 5.84978',
  email: 'school1@school.com',
  phoneNumber: '(123) 1111-1111',
  contactPerson: 'School Owner',
  countryId,
})

const createSchool = async (
  name: string,
  countryId: number,
  externalId: string,
  location1: string,
  location2: string,
  location3: string,
  location4: string,
  metricsId: number[],
  contractId?: number,
  generateMetric?: GenerateMetric,
  values?: number[]
) => {
  return School.create(
    generateSchool(name, countryId, externalId, location1, location2, location3, location4)
  ).then((school) => {
    if (generateMetric && contractId && values) {
      school
        .related('measures')
        .createMany(generateMetric(school.id, metricsId, contractId, values))
    }
    return school
  })
}

const generateMetric = (
  schoolId: number,
  metricsId: number[],
  contractId: number,
  values: number[]
) => {
  return [
    {
      metricId: metricsId[0],
      value: values[0],
      schoolId: schoolId,
      contractId: contractId,
    },
    {
      metricId: metricsId[1],
      value: values[1],
      schoolId: schoolId,
      contractId: contractId,
    },
    {
      metricId: metricsId[2],
      value: values[2],
      schoolId: schoolId,
      contractId: contractId,
    },
    {
      metricId: metricsId[3],
      value: values[3],
      schoolId: schoolId,
      contractId: contractId,
    },
  ]
}
