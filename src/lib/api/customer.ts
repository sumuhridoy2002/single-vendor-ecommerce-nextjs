import { getBaseUrl } from "./client";

const TOKEN_KEY = "access_token";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export interface ProfileUpdateData {
  id: number;
  name?: string;
  avatar?: string;
  joined_at?: string;
  email?: string;
}

export interface Address {
  id: number;
  address_type: string;
  receiver_name: string;
  receiver_phone: string;
  address_line: string;
  city: string;
  area: string;
  is_default: boolean;
  full_address: string;
}

export interface CreateAddressPayload {
  address_type: string;
  receiver_name: string;
  receiver_phone: string;
  address_line: string;
  city: string;
  area: string;
}

export async function updateProfile(params: {
  name: string;
  email: string;
  avatar?: File;
}): Promise<ProfileUpdateData> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Please log in again");
  }

  const baseUrl = getBaseUrl();
  const formData = new FormData();
  formData.append("name", params.name);
  formData.append("email", params.email);
  if (params.avatar) {
    formData.append("avatar", params.avatar);
  }

  const response = await fetch(`${baseUrl}/customer/profile-update`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (response.status !== 200) {
    throw new Error((data.message as string) || "Failed to update profile");
  }

  return data.data as ProfileUpdateData;
}

export async function phoneUpdateRequest(phone: string): Promise<void> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Please log in again");
  }

  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/customer/phone-update-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ phone }),
  });

  const data = await response.json().catch(() => ({}));
  if (response.status !== 200) {
    throw new Error((data.message as string) || "Failed to send OTP");
  }
}

export async function phoneUpdateVerify(
  phone: string,
  otp: string
): Promise<void> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Please log in again");
  }

  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/customer/phone-update-verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ phone, otp }),
  });

  const data = await response.json().catch(() => ({}));
  if (response.status !== 200) {
    throw new Error((data.message as string) || "Verification failed");
  }
}

export async function getAddresses(): Promise<Address[]> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Please log in again");
  }

  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/customer/addresses`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data.message as string) || "Failed to fetch addresses");
  }

  return (data.data ?? []) as Address[];
}

export async function addAddress(payload: CreateAddressPayload): Promise<Address> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Please log in again");
  }

  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/customer/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (response.status !== 201) {
    throw new Error((data.message as string) || "Failed to add address");
  }

  return data.data as Address;
}

export async function setDefaultAddress(addressId: number): Promise<void> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Please log in again");
  }

  const baseUrl = getBaseUrl();
  const response = await fetch(
    `${baseUrl}/customer/addresses/${addressId}/set-default`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json().catch(() => ({}));
  if (response.status !== 200) {
    throw new Error(
      (data.message as string) || "Failed to set default address"
    );
  }
}
