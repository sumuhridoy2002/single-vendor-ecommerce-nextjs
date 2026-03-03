import type { Address as ApiAddress, CreateAddressPayload } from "./customer";
import type { Address as StoreAddress, AddressType } from "@/store/address-store";

/** Minimal tree shape for delivery area options (value/label/children). */
export interface DeliveryAreaOption {
  value: string;
  label: string;
  children?: DeliveryAreaOption[];
}

const STORE_ADDRESS_TYPES: AddressType[] = ["home", "office", "hometown"];

function normalizeAddressType(apiType: string): AddressType {
  const lower = apiType?.toLowerCase() ?? "";
  return STORE_ADDRESS_TYPES.includes(lower as AddressType)
    ? (lower as AddressType)
    : "home";
}

function capitalizeAddressType(type: AddressType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Map API address to store address shape.
 */
export function apiAddressToStore(api: ApiAddress): StoreAddress {
  return {
    id: String(api.id),
    fullName: api.receiver_name,
    phone: api.receiver_phone,
    address: api.address_line,
    deliveryArea: api.area,
    addressType: normalizeAddressType(api.address_type),
    isDefault: api.is_default,
  };
}

export interface AddressFormValues {
  fullName: string;
  phone: string;
  deliveryArea: string;
  address: string;
  addressType: AddressType;
  isDefault: boolean;
}

/**
 * Map form values + city/area to API create payload.
 */
export function formToCreatePayload(
  form: AddressFormValues,
  city: string,
  area: string
): CreateAddressPayload {
  return {
    address_type: capitalizeAddressType(form.addressType),
    receiver_name: form.fullName,
    receiver_phone: form.phone,
    address_line: form.address,
    city,
    area,
  };
}

/**
 * Find option by value in tree and return its label and parent label (city).
 * Used to derive city/area for the API from the single deliveryArea form value.
 */
export function getCityAreaFromTree(
  options: DeliveryAreaOption[],
  value: string
): { city: string; area: string } {
  function find(
    opts: DeliveryAreaOption[],
    val: string,
    parentLabel: string | null
  ): { city: string; area: string } | null {
    for (const opt of opts) {
      if (opt.value === val) {
        return {
          city: parentLabel ?? opt.label,
          area: opt.label,
        };
      }
      if (opt.children?.length) {
        const found = find(opt.children, val, opt.label);
        if (found) return found;
      }
    }
    return null;
  }
  const found = find(options, value, null);
  if (found) return found;
  return { city: value, area: value };
}
