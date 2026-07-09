export type ProductStock = {
  id: string;
  name: string;
  stockQuantity: number;
  minimumStock: number;
};

export type StockMovementDraft = {
  productId: string;
  type: "sale" | "internalUse" | "adjustment" | "entry" | "exit";
  quantity: number;
  reason: string;
};

export type StockResult =
  | {
      ok: true;
      product: ProductStock;
      movement: StockMovementDraft;
      lowStock: boolean;
    }
  | {
      ok: false;
      reason: "insufficient_stock" | "invalid_quantity";
    };

export function applyProductSale(
  product: ProductStock,
  quantity: number,
): StockResult {
  if (quantity <= 0) {
    return { ok: false, reason: "invalid_quantity" };
  }

  if (product.stockQuantity < quantity) {
    return { ok: false, reason: "insufficient_stock" };
  }

  const updatedProduct = {
    ...product,
    stockQuantity: product.stockQuantity - quantity,
  };

  return {
    ok: true,
    product: updatedProduct,
    movement: {
      productId: product.id,
      type: "sale",
      quantity: -quantity,
      reason: "Venda no checkout",
    },
    lowStock: updatedProduct.stockQuantity <= updatedProduct.minimumStock,
  };
}

export function consumeInternalStock(
  product: ProductStock,
  quantity: number,
  serviceName: string,
): StockResult {
  const sale = applyProductSale(product, quantity);

  if (!sale.ok) {
    return sale;
  }

  return {
    ...sale,
    movement: {
      productId: product.id,
      type: "internalUse",
      quantity: -quantity,
      reason: `Consumo interno: ${serviceName}`,
    },
  };
}
