import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.supplierInvoice.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.paymentLedgerEntry.deleteMany();
  await prisma.orderMilestone.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.session.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.shipperProfile.deleteMany();
  await prisma.inspectorProfile.deleteMany();
  await prisma.supplierProfile.deleteMany();
  await prisma.entrepreneurProfile.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$executeRaw`PRAGMA foreign_keys = OFF;`;

  // Users
  const founder = await prisma.user.create({
    data: {
      email: "founder@bandachao.com",
      name: "المؤسس",
      role: "PLATFORM_ADMIN",
    },
  });

  const supplier1 = await prisma.user.create({
    data: {
      email: "supplier1@example.com",
      name: "مورد748",
      role: "SUPPLIER",
    },
  });

  const inspector1 = await prisma.user.create({
    data: {
      email: "inspector1@example.com",
      name: "مفتش دبي",
      role: "INSPECTOR",
    },
  });

  const shipper1 = await prisma.user.create({
    data: {
      email: "shipper1@example.com",
      name: "Aramex Partner",
      role: "SHIPPER",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      email: "customer1@example.com",
      name: "عميل الرياض",
      role: "CUSTOMER",
    },
  });

  const entrepreneurProfile = await prisma.entrepreneurProfile.create({
    data: {
      userId: founder.id,
      approved: true,
      commissionRate: 0.20,
    },
  });

  const supplierProfile = await prisma.supplierProfile.create({
    data: {
      userId: supplier1.id,
      companyName: "Shenzhen Tech Factory #748",
      country: "China",
      verified: true,
      qualityScore: 95,
    },
  });

  await prisma.inspectorProfile.create({
    data: {
      userId: inspector1.id,
      companyName: "Dubai Inspection Services",
      country: "UAE",
      certified: true,
    },
  });

  await prisma.shipperProfile.create({
    data: {
      userId: shipper1.id,
      companyName: "Aramex Express Partner",
      country: "UAE",
    },
  });

  const customerProfile = await prisma.customerProfile.create({
    data: {
      userId: customer1.id,
      shippingAddressJson: JSON.stringify({
        city: "Riyadh",
        country: "KSA",
        address: "123 King Fahd Road",
      }),
    },
  });

  const product = await prisma.product.create({
    data: {
      titleAr: "سجادة سيارة فاخرة مبطنة",
      titleZh: "汽车豪华地毯",
      description: "سجادة سيارة مخصصة لمرسيدس S-Class، فاخرة، مقاومة للبقع",
      category: "سيارات",
      entrepreneurId: entrepreneurProfile.id,
      supplierId: supplierProfile.id,
      approved: true,
      active: true,
      qualitySignalsJson: JSON.stringify({
        trendScore: 88,
        certifications: ["ISO9001"],
      }),
    },
  });

  const order = await prisma.order.create({
    data: {
      customerId: customerProfile.id,
      entrepreneurId: entrepreneurProfile.id,
      supplierId: supplierProfile.id,
      inspectorId: inspector1.id,
      shipperId: shipper1.id,
      totalAmount: 120.0,
      currency: "AED",
      paymentStatus: "HELD",
      currentStage: "APPROVED",
      trackingNumber: "AE123456789",
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: product.id,
      quantity: 1,
      unitPrice: 120.0,
      totalPrice: 120.0,
    },
  });

  const stages = ["PENDING", "APPROVED", "PROCURED", "INSPECTED", "PACKAGED", "SHIPPED", "DELIVERED"];
  for (const stage of stages) {
    await prisma.orderMilestone.create({
      data: {
        orderId: order.id,
        stage,
        isCompleted: stage === "APPROVED",
        requiredEvidenceTypes: JSON.stringify(
          stage === "INSPECTED" ? ["IMAGE", "VIDEO"] : ["IMAGE"]
        ),
      },
    });
  }

  await prisma.paymentLedgerEntry.create({
    data: {
      orderId: order.id,
      amount: 120.0,
      currency: "AED",
      status: "HELD",
      payeeUserId: supplier1.id,
      payeeRole: "SUPPLIER",
    },
  });

  console.log("Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
