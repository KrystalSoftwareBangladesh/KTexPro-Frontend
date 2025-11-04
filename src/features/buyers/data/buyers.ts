import { faker } from '@faker-js/faker'
import type {
  Buyer,
  BuyerContact,
  BuyerOrder,
  BuyerPricing,
  BuyerCompliance,
  BuyerCommunication,
  BuyerSample,
  BuyerDocument,
  BuyerAnalytics,
} from './schema'

faker.seed(12345)

export const buyers: Buyer[] = Array.from({ length: 50 }, () => {
  const company = faker.company.name()
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    company,
    country: faker.location.country(),
    contactEmail: faker.internet.email().toLowerCase(),
    contactPhone: faker.phone.number({ style: 'international' }),
    website: `https://www.${company.toLowerCase().replace(/\s+/g, '')}.com`,
    logo: faker.image.avatar(),
    status: faker.helpers.arrayElement([
      'active',
      'inactive',
      'pending',
      'archived',
    ]),
    category: faker.helpers.arrayElement([
      'retail',
      'wholesale',
      'distributor',
      'direct',
    ]),
    relationshipSince: faker.date.past({ years: 5 }),
    keyAccountManager: faker.person.fullName(),
    notes: faker.lorem.sentence(),
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: faker.date.recent(),
  }
})

export const buyerContacts: BuyerContact[] = buyers.flatMap((buyer) =>
  Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, (_, index) => ({
    id: faker.string.uuid(),
    buyerId: buyer.id,
    name: faker.person.fullName(),
    designation: faker.person.jobTitle(),
    email: faker.internet.email().toLowerCase(),
    phone: faker.phone.number({ style: 'international' }),
    department: faker.helpers.arrayElement([
      'purchasing',
      'quality_control',
      'design',
      'merchandising',
      'finance',
    ]),
    isPrimary: index === 0,
    createdAt: faker.date.past(),
  }))
)

export const buyerOrders: BuyerOrder[] = buyers.flatMap((buyer) =>
  Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => ({
    id: faker.string.uuid(),
    buyerId: buyer.id,
    orderNumber: `PO-${faker.string.alphanumeric(8).toUpperCase()}`,
    orderDate: faker.date.past({ years: 1 }),
    status: faker.helpers.arrayElement([
      'pending',
      'in_production',
      'shipped',
      'completed',
      'cancelled',
    ]),
    totalValue: faker.number.float({ min: 5000, max: 500000, fractionDigits: 2 }),
    currency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', 'BDT']),
    deliveryDate: faker.date.future(),
    productsCount: faker.number.int({ min: 1, max: 20 }),
  }))
)

export const buyerPricing: BuyerPricing[] = buyers.flatMap((buyer) =>
  Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
    id: faker.string.uuid(),
    buyerId: buyer.id,
    productCategory: faker.commerce.department(),
    priceRange: `$${faker.number.int({ min: 10, max: 100 })} - $${faker.number.int({ min: 100, max: 500 })}`,
    paymentTerms: faker.helpers.arrayElement(['LC', 'TT', 'COD', 'NET30', 'NET60']),
    currency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', 'BDT']),
    incoterms: faker.helpers.arrayElement(['FOB', 'CIF', 'EXW', 'DDP', 'FCA']),
    bankDetails: faker.finance.accountNumber(),
    freightInfo: faker.company.name() + ' Freight',
    updatedAt: faker.date.recent(),
  }))
)

export const buyerCompliance: BuyerCompliance[] = buyers.flatMap((buyer) =>
  Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => {
    const issuedDate = faker.date.past({ years: 2 })
    const expiryDate = faker.date.future({ years: 1 })
    return {
      id: faker.string.uuid(),
      buyerId: buyer.id,
      certificateType: faker.helpers.arrayElement([
        'BSCI',
        'SEDEX',
        'WRAP',
        'GOTS',
        'OEKO-TEX',
        'ISO9001',
        'ISO14001',
      ]),
      certificateNumber: `CERT-${faker.string.alphanumeric(10).toUpperCase()}`,
      issuedDate,
      expiryDate,
      isValid: expiryDate > new Date(),
      fileUrl: `/documents/certificates/${faker.string.alphanumeric(8)}.pdf`,
    }
  })
)

export const buyerCommunications: BuyerCommunication[] = buyers.flatMap((buyer) =>
  Array.from({ length: faker.number.int({ min: 3, max: 10 }) }, () => ({
    id: faker.string.uuid(),
    buyerId: buyer.id,
    type: faker.helpers.arrayElement(['meeting', 'email', 'call', 'video_call']),
    subject: faker.lorem.sentence(),
    notes: faker.lorem.paragraph(),
    date: faker.date.recent({ days: 90 }),
    participants: Array.from(
      { length: faker.number.int({ min: 2, max: 5 }) },
      () => faker.person.fullName()
    ),
    attachments: faker.datatype.boolean()
      ? Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
          `/files/${faker.string.alphanumeric(8)}.pdf`
        )
      : undefined,
    followUpDate: faker.datatype.boolean() ? faker.date.soon() : undefined,
    createdBy: faker.person.fullName(),
  }))
)

export const buyerSamples: BuyerSample[] = buyers.flatMap((buyer) =>
  Array.from({ length: faker.number.int({ min: 2, max: 8 }) }, () => ({
    id: faker.string.uuid(),
    buyerId: buyer.id,
    sampleName: faker.commerce.productName(),
    designCode: `DES-${faker.string.alphanumeric(6).toUpperCase()}`,
    requestDate: faker.date.past({ years: 0.5 }),
    sentDate: faker.datatype.boolean() ? faker.date.recent({ days: 30 }) : undefined,
    status: faker.helpers.arrayElement([
      'pending',
      'in_development',
      'sent',
      'approved',
      'rejected',
    ]),
    comments: faker.lorem.sentence(),
    imageUrl: faker.image.url(),
  }))
)

export const buyerDocuments: BuyerDocument[] = buyers.flatMap((buyer) =>
  Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => ({
    id: faker.string.uuid(),
    buyerId: buyer.id,
    documentName: faker.system.fileName(),
    documentType: faker.helpers.arrayElement([
      'Contract',
      'Tech Pack',
      'Style Sheet',
      'Agreement',
      'Invoice',
      'Specification',
    ]),
    fileUrl: `/documents/${faker.string.alphanumeric(10)}.pdf`,
    uploadedBy: faker.person.fullName(),
    uploadedAt: faker.date.recent({ days: 60 }),
    fileSize: faker.number.int({ min: 100, max: 5000 }),
  }))
)

export const buyerAnalytics: BuyerAnalytics[] = buyers.map((buyer) => {
  const buyerOrdersList = buyerOrders.filter((order) => order.buyerId === buyer.id)
  const totalOrders = buyerOrdersList.length
  const totalRevenue = buyerOrdersList.reduce((sum, order) => sum + order.totalValue, 0)

  return {
    buyerId: buyer.id,
    totalOrders,
    totalRevenue,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    onTimeDeliveryRate: faker.number.float({ min: 70, max: 100, fractionDigits: 1 }),
    paymentPerformance: faker.number.float({ min: 80, max: 100, fractionDigits: 1 }),
    yearlyOrders: [2022, 2023, 2024, 2025].map((year) => ({
      year,
      orders: faker.number.int({ min: 5, max: 30 }),
      revenue: faker.number.float({ min: 50000, max: 500000, fractionDigits: 2 }),
    })),
  }
})
