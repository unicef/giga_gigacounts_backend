import School from 'App/Models/School'
import Factory from '@ioc:Adonis/Lucid/Factory'
import CountryFactory from './CountryFactory'
import MeasureFactory from './MeasureFactory'
import ContractFactory from './ContractFactory'

export default Factory.define(School, ({ faker }) => {
  return {
    name: faker.company.companyName(),
    address: faker.address.streetAddress(),
    location1: faker.address.buildingNumber(),
    location2: faker.address.cityName(),
    location3: faker.address.countryCode(),
    location4: faker.address.county(),
    educationLevel: 'high school',
    geopoint: `${faker.address.latitude()},${faker.address.longitude()}`,
    phoneNumber: faker.phone.phoneNumber(),
    contactPerson: faker.name.firstName(),
    externalId: '1001',
  }
})
  .relation('country', () => CountryFactory)
  .relation('measures', () => MeasureFactory)
  .relation('contracts', () => ContractFactory)
  .build()
