"use client";

import { Button } from "@/components/ui/button";
import { setDefaultAddress as setDefaultAddressApi, deleteAddressApi } from "@/lib/api/customer";
import { globalQueryKeys } from "@/lib/query-keys";
import { useAddressStore } from "@/store/address-store";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AddressCard } from "@/components/address/AddressCard";

export default function AddressesPage() {
  const queryClient = useQueryClient();
  const addresses = useAddressStore((s) => s.addresses);
  const selectedAddress = useAddressStore((s) => s.selectedAddress);
  const openAddressModal = useAddressStore((s) => s.openAddressModal);
  const openAddForm = useAddressStore((s) => s.openAddForm);
  const openEditForm = useAddressStore((s) => s.openEditForm);
  const setDefaultAddress = useAddressStore((s) => s.setDefaultAddress);
  const setSelectedAddress = useAddressStore((s) => s.setSelectedAddress);
  const deleteAddress = useAddressStore((s) => s.deleteAddress);

  const handleAddNew = () => {
    openAddressModal();
    openAddForm();
  };

  const handleEdit = (id: string) => {
    openAddressModal();
    openEditForm(id);
  };

  const handleSetDefault = async (id: string) => {
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) return;
    try {
      await setDefaultAddressApi(numId);
      queryClient.invalidateQueries({ queryKey: globalQueryKeys.customerAddresses });
      setDefaultAddress(id);
      setSelectedAddress(id);
      toast.success("Default address updated");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to set default address";
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) return;
    try {
      await deleteAddressApi(numId);
      queryClient.invalidateQueries({ queryKey: globalQueryKeys.customerAddresses });
      deleteAddress(id);
      toast.success("Address removed");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete address";
      toast.error(message);
    }
  };

  return (
    <div className="container max-w-2xl py-6 md:py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Manage Address</h1>
        <Button onClick={handleAddNew} className="bg-teal-600 hover:bg-teal-700">
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border bg-muted/20">
          <p className="text-muted-foreground">No addresses yet.</p>
          <Button onClick={handleAddNew} variant="outline" className="mt-4">
            Add your first address
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              isSelected={selectedAddress?.id === addr.id}
              onSetDefault={() => handleSetDefault(addr.id)}
              onEdit={() => handleEdit(addr.id)}
              onDelete={() => handleDelete(addr.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
