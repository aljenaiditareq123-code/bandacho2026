export type CalcInput = {
  supplierPriceRMB: number;
  quantity: number;
  weightKg: number;
  shippingPerKgRMB: number;
  insurance: boolean;
};

export type CalcOutputItem = {
  key: string;
  amountAED: number;
  amountRMB: number;
};

export type PlatformSplit = {
  ownerNetAED: number;
  silkRoadAED: number;
  devAED: number;
  legalAED: number;
  totalPlatformFeeAED: number;
};

export type CalcOutput = {
  items: CalcOutputItem[];
  platformSplit: PlatformSplit;
  totals: { AED: number; USD: number; SAR: number };
  fx: { RMB_TO_AED: number; AED_TO_USD: number; AED_TO_SAR: number };
};

const NUM = (n: number) => Math.round(n * 100) / 100;

export function calcPricing(input: CalcInput): CalcOutput {
  const RMB_TO_AED = Number(process.env.FX_RMB_TO_AED ?? 0.51);
  const AED_TO_USD = Number(process.env.FX_AED_TO_USD ?? 0.2723);
  const AED_TO_SAR = Number(process.env.FX_AED_TO_SAR ?? 1.0209);

  const qty = Math.max(1, Number.isFinite(input.quantity) ? Math.floor(input.quantity) : 1);
  const supplierTotalRMB = Math.max(0, (input.supplierPriceRMB || 0) * qty);
  const shippingRMB = Math.max(0, (input.weightKg || 0) * (input.shippingPerKgRMB || 0));
  const insuranceRMB = input.insurance ? supplierTotalRMB * 0.015 : 0;

  const subtotalRMB = supplierTotalRMB + shippingRMB + insuranceRMB;
  const subtotalAED = subtotalRMB * RMB_TO_AED;

  // 10% platform fee on gross subtotal
  const totalPlatformFeeAED = NUM(subtotalAED * 0.1);
  const ownerNetAED = NUM(totalPlatformFeeAED * (5.5 / 10));
  const silkRoadAED = NUM(totalPlatformFeeAED * (1.5 / 10));
  const devAED = NUM(totalPlatformFeeAED * (1.5 / 10));
  const legalAED = NUM(
    Math.max(0, totalPlatformFeeAED - ownerNetAED - silkRoadAED - devAED),
  );

  const totalAED = NUM(subtotalAED + totalPlatformFeeAED);
  const totalUSD = NUM(totalAED * AED_TO_USD);
  const totalSAR = NUM(totalAED * AED_TO_SAR);

  const items: CalcOutputItem[] = [
    {
      key: 'supplier',
      amountRMB: NUM(supplierTotalRMB),
      amountAED: NUM(supplierTotalRMB * RMB_TO_AED),
    },
    {
      key: 'shipping',
      amountRMB: NUM(shippingRMB),
      amountAED: NUM(shippingRMB * RMB_TO_AED),
    },
    ...(insuranceRMB > 0
      ? [
          {
            key: 'insurance' as const,
            amountRMB: NUM(insuranceRMB),
            amountAED: NUM(insuranceRMB * RMB_TO_AED),
          },
        ]
      : []),
    {
      key: 'subtotal',
      amountRMB: NUM(subtotalRMB),
      amountAED: NUM(subtotalAED),
    },
    {
      key: 'platform',
      amountRMB: 0,
      amountAED: totalPlatformFeeAED,
    },
    {
      key: 'total',
      amountRMB: 0,
      amountAED: totalAED,
    },
  ];

  return {
    items,
    platformSplit: {
      ownerNetAED,
      silkRoadAED,
      devAED,
      legalAED,
      totalPlatformFeeAED,
    },
    totals: { AED: totalAED, USD: totalUSD, SAR: totalSAR },
    fx: { RMB_TO_AED, AED_TO_USD, AED_TO_SAR },
  };
}

export const DEFAULT_CALC_INPUT: CalcInput = {
  supplierPriceRMB: 1500,
  quantity: 1,
  weightKg: 5,
  shippingPerKgRMB: 28,
  insurance: false,
};
