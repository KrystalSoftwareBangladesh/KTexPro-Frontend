import { faker } from '@faker-js/faker'
import type { Supplier } from './schema'

faker.seed(54321)

export const suppliers: Supplier[] = Array.from({ length: 30 }, () => {
  const company = faker.company.name()
  const capabilitiesPool = ['yarn', 'knitting', 'dyeing', 'sewing', 'printing', 'embroidery', 'washing', 'accessories'] as const
  const selectedCapabilities = faker.helpers.arrayElements(capabilitiesPool, faker.number.int({ min: 1, max: 4 }))
  
  const certificationsCount = faker.number.int({ min: 1, max: 3 })
  const certifications = Array.from({ length: certificationsCount }, () => {
    const issuedDate = faker.date.past({ years: 2 })
    return {
      id: faker.string.uuid(),
      type: faker.helpers.arrayElement(['BSCI', 'SEDEX', 'WRAP', 'GOTS', 'OEKO-TEX', 'ISO9001', 'ISO14001', 'SA8000'] as const),
      certificateNumber: `CERT-${faker.string.alphanumeric(10).toUpperCase()}`,
      issuedDate,
      expiryDate: faker.date.future({ years: 2, refDate: issuedDate }),
      fileUrl: `/documents/certs/${faker.string.alphanumeric(8)}.pdf`,
    }
  })

  const documentsCount = faker.number.int({ min: 2, max: 5 })
  const documents = Array.from({ length: documentsCount }, () => ({
    id: faker.string.uuid(),
    name: faker.system.fileName(),
    type: faker.helpers.arrayElement(['Trade License', 'Factory Profile', 'Compliance Certificate', 'Other']),
    url: `/documents/${faker.string.alphanumeric(10)}.pdf`,
    uploadedAt: faker.date.recent({ days: 90 }),
  }))

  return {
    id: faker.string.uuid(),
    supplierName: company,
    companyType: faker.helpers.arrayElement(['factory', 'trader'] as const),
    website: `https://www.${company.toLowerCase().replace(/\s+/g, '')}.com`,
    email: faker.internet.email().toLowerCase(),
    phoneNumber: faker.phone.number({ style: 'international' }),
    address: faker.location.streetAddress({ useFullAddress: true }),
    country: faker.helpers.arrayElement([
      'Bangladesh',
      'China',
      'India',
      'Vietnam',
      'Pakistan',
      'Turkey',
      'Indonesia',
      'Cambodia',
      'Sri Lanka',
      'Thailand',
    ]),
    contactPerson: {
      fullName: faker.person.fullName(),
      designation: faker.person.jobTitle(),
      phone: faker.phone.number({ style: 'international' }),
      email: faker.internet.email().toLowerCase(),
    },
    capabilities: selectedCapabilities,
    certifications,
    yearEstablished: faker.number.int({ min: 1990, max: 2020 }),
    totalWorkers: faker.number.int({ min: 50, max: 5000 }),
    productionCapacity: `${faker.number.int({ min: 10000, max: 500000 })} pieces/month`,
    leadTime: `${faker.number.int({ min: 15, max: 90 })} days`,
    paymentTerms: faker.helpers.arrayElement(['LC', 'TT', 'NET30', 'NET60', 'COD'] as const),
    documents,
    status: faker.helpers.arrayElement(['active', 'pending', 'inactive', 'rejected'] as const),
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: faker.date.recent(),
  }
})
