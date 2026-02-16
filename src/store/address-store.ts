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
  selectedAddress: Address | null;
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
  selectedAddress: null,
  addresses: [],

  openAddressModal: () =>
    set((state) => {
      const defaultAddr =
        state.addresses.find((a) => a.isDefault) ?? state.addresses[0] ?? null;
      const selected =
        state.selectedAddress &&
        state.addresses.some((a) => a.id === state.selectedAddress?.id)
          ? state.selectedAddress
          : defaultAddr;
      return { modalOpen: true, formOpen: false, editingAddressId: null, selectedAddress: selected };
    }),

  setSelectedAddress: (id) =>
    set((state) => {
      const address = state.addresses.find((a) => a.id === id) ?? null;
      return { selectedAddress: address };
    }),

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
        state.selectedAddress?.id === id
          ? (next.find((a) => a.isDefault) ?? next[0] ?? null)
          : state.selectedAddress;
      return { addresses: next, selectedAddress: nextSelected };
    }),
}));
