import prisma from '@/lib/prisma';

export const ORDER_STAGES = [
  'PENDING',
  'APPROVED',
  'PROCURED',
  'INSPECTED',
  'PACKAGED',
  'SHIPPED',
  'DELIVERED',
] as const;
export type StageName = (typeof ORDER_STAGES)[number];

export async function getDashboardKPIs() {
  try {
    const [totalOrders, orders] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        select: {
          id: true,
          totalAmount: true,
          currency: true,
          currentStage: true,
        },
      }),
    ]);

    const revenueAED = orders
      .filter((o) => (o.currency ?? 'AED') === 'AED')
      .reduce((sum, o) => sum + Number(o.totalAmount ?? 0), 0);

    const commissionsAED = (await prisma.commission.findMany()).reduce(
      (sum, c) => sum + Number(c.amount ?? 0) * 0.2,
      0,
    );

    const activeOrders = orders.filter(
      (o) => o.currentStage !== 'DELIVERED' && o.currentStage !== 'CANCELLED',
    ).length;

    return {
      totalOrders,
      activeOrders,
      revenueTotalAED: revenueAED,
      commissionsTotalAED: commissionsAED,
    };
  } catch (e: any) {
    console.warn('[data.getDashboardKPIs] failed:', e?.message ?? e);
    return { totalOrders: 0, activeOrders: 0, revenueTotalAED: 0, commissionsTotalAED: 0 };
  }
}

export async function getOrdersList() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return orders as any[];
  } catch (e: any) {
    console.warn('[data.getOrdersList] failed:', e?.message ?? e);
    return [] as any[];
  }
}

export async function getOrderByTracking(trackingNumber: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { trackingNumber },
    });
    return order as any;
  } catch (e: any) {
    console.warn('[data.getOrderByTracking] failed:', e?.message ?? e);
    return null;
  }
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return products as any[];
  } catch (e: any) {
    console.warn('[data.getProducts] failed:', e?.message ?? e);
    return [] as any[];
  }
}

export function stageColor(stage: string, completed: boolean | undefined | null, active: boolean) {
  if (completed) return 'success';
  if (active) return 'warning';
  return 'pending';
}

export function requiredEvidenceTypesFor(stage: string): string[] {
  const m: Record<string, string[]> = {
    PENDING: ['Purchase Quote', 'Buyer Agreement'],
    APPROVED: ['Approval Stamp', 'Payment Receipt'],
    PROCURED: ['Supplier Invoice', 'Warehouse Receipt'],
    INSPECTED: ['QC Report', 'Inspection Photos', 'Inspection Video'],
    PACKAGED: ['Packaging Photos', 'Commercial Invoice', 'Packing List'],
    SHIPPED: ['Air Waybill', 'Customs Declaration'],
    DELIVERED: ['Delivery Receipt', 'Buyer QR Scan'],
  };
  return m[stage] ?? [];
}
