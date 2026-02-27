import { create } from "zustand"
import type { Product } from "@/types/product"

interface ProductDetailsState {
  productById: Record<string, Product>
  setProduct: (id: string, product: Product | null) => void
}

export const useProductDetailsStore = create<ProductDetailsState>((set) => ({
  productById: {},
  setProduct: (id, product) =>
    set((state) => ({
      productById: product
        ? { ...state.productById, [id]: product }
        : (() => {
            const next = { ...state.productById }
            delete next[id]
            return next
          })(),
    })),
}))
