import { create } from "zustand";

export type AddressType = "home" | "office" | "hometown";

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  deliveryArea: string;
  address: string;
  addressType: AddressType;
  isDefault: boolean;
}

interface AddressFormData {
  fullName: string;
  phone: string;
  deliveryArea: string;
  address: string;
  addressType: AddressType;
  isDefault: boolean;
}

interface AddressState {
  modalOpen: boolean;
  formOpen: boolean;
  editingAddressId: string | null;
  selectedAddressId: string | null;
  addresses: Address[];
  openAddressModal: () => void;
  closeAddressModal: () => void;
  openAddForm: () => void;
  openEditForm: (id: string) => void;
  closeForm: () => void;
  setSelectedAddress: (id: string) => void;
  saveAddress: (data: AddressFormData) => void;
  setDefaultAddress: (id: string) => void;
  deleteAddress: (id: string) => void;
}

function ensureSingleDefault(addresses: Address[], defaultId: string): Address[] {
  return addresses.map((a) => ({
    ...a,
    isDefault: a.id === defaultId,
  }));
}

export const useAddressStore = create<AddressState>((set) => ({
  modalOpen: false,
  formOpen: false,
  editingAddressId: null,
  selectedAddressId: null,
  addresses: [],

  openAddressModal: () =>
    set((state) => {
      const firstId = state.addresses[0]?.id ?? null;
      const defaultId = state.addresses.find((a) => a.isDefault)?.id ?? firstId;
      const selected = state.selectedAddressId && state.addresses.some((a) => a.id === state.selectedAddressId)
        ? state.selectedAddressId
        : defaultId;
      return { modalOpen: true, formOpen: false, editingAddressId: null, selectedAddressId: selected };
    }),

  setSelectedAddress: (id) => set({ selectedAddressId: id }),

  closeAddressModal: () =>
    set({ modalOpen: false, formOpen: false, editingAddressId: null }),

  openAddForm: () => set({ formOpen: true, editingAddressId: null }),

  openEditForm: (id) => set({ formOpen: true, editingAddressId: id }),

  closeForm: () => set({ formOpen: false, editingAddressId: null }),

  saveAddress: (data) =>
    set((state) => {
      const nextAddresses = [...state.addresses];
      if (state.editingAddressId) {
        const idx = nextAddresses.findIndex((a) => a.id === state.editingAddressId);
        if (idx !== -1) {
          const updated = { ...nextAddresses[idx], ...data };
          nextAddresses[idx] = updated;
          const normalized = data.isDefault
            ? ensureSingleDefault(nextAddresses, updated.id)
            : nextAddresses;
          return {
            addresses: normalized,
            formOpen: false,
            editingAddressId: null,
          };
        }
      }
      const newAddress: Address = {
        ...data,
        id: crypto.randomUUID(),
      };
      const withNew = nextAddresses.concat(newAddress);
      const normalized = data.isDefault
        ? ensureSingleDefault(withNew, newAddress.id)
        : withNew;
      return {
        addresses: normalized,
        formOpen: false,
        editingAddressId: null,
      };
    }),

  setDefaultAddress: (id) =>
    set((state) => ({
      addresses: ensureSingleDefault(state.addresses, id),
    })),

  deleteAddress: (id) =>
    set((state) => {
      const filtered = state.addresses.filter((a) => a.id !== id);
      const deleted = state.addresses.find((a) => a.id === id);
      const wasDefault = deleted?.isDefault ?? false;
      const next =
        wasDefault && filtered.length > 0
          ? ensureSingleDefault(filtered, filtered[0].id)
          : filtered;
      const nextSelected =
        state.selectedAddressId === id
          ? (next.find((a) => a.isDefault)?.id ?? next[0]?.id ?? null)
          : state.selectedAddressId;
      return { addresses: next, selectedAddressId: nextSelected };
    }),
}));
