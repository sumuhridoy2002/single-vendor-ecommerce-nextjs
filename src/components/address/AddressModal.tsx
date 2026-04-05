"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NestedSelect } from "@/components/ui/nested-select";
import { Switch } from "@/components/ui/switch";
import {
  apiAddressToStore,
  formToCreatePayload,
  getCityAreaFromDeliveryPath,
} from "@/lib/api/address-mappers";
import {
  deliveryZonesToNestedOptions,
  fetchDeliveryZones,
  findDeliveryPathForAddress,
} from "@/lib/api/delivery-zones";
import {
  addAddress,
  deleteAddressApi,
  getAddresses,
  setDefaultAddress as setDefaultAddressApi,
  updateAddress,
} from "@/lib/api/customer";
import { globalQueryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { useAddressStore, type AddressType } from "@/store/address-store";
import { useAuth } from "@/contexts/AuthContext";
import { useWhenLoggedIn } from "@/hooks/useWhenLoggedIn";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Home,
  Loader2,
  X,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AddressCard } from "@/components/address/AddressCard";

const addressFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  deliveryArea: z.string().min(1, "Please select a delivery area"),
  address: z.string().min(1, "Address is required"),
  addressType: z.enum(["home", "office", "hometown"]),
  isDefault: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

const ADDRESS_TYPE_OPTIONS: {
  value: AddressType;
  label: string;
  icon: typeof Home;
}[] = [
    { value: "home", label: "Home", icon: Home },
    { value: "office", label: "Office", icon: Briefcase },
    { value: "hometown", label: "Hometown", icon: Building2 },
  ];

export function AddressModal() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const whenLoggedIn = useWhenLoggedIn();
  const {
    modalOpen,
    formOpen,
    editingAddressId,
    selectedAddress,
    addresses,
    closeAddressModal,
    openAddForm,
    openEditForm,
    closeForm,
    setSelectedAddress,
    setDefaultAddress,
    setAddresses,
    deleteAddress,
  } = useAddressStore();

  // If address modal opened while not logged in, close it and open auth modal
  useEffect(() => {
    if (modalOpen && !isAuthenticated) {
      closeAddressModal();
      whenLoggedIn(() => {});
    }
  }, [modalOpen, isAuthenticated, closeAddressModal, whenLoggedIn]);

  const { data: queryAddresses, isLoading: addressesLoading, error: addressesError } = useQuery({
    queryKey: globalQueryKeys.customerAddresses,
    queryFn: async () => {
      const list = await getAddresses();
      return list.map(apiAddressToStore);
    },
    enabled: modalOpen && isAuthenticated,
  });

  const {
    data: zonesData,
    isLoading: zonesLoading,
    error: zonesError,
  } = useQuery({
    queryKey: globalQueryKeys.deliveryZones,
    queryFn: fetchDeliveryZones,
    enabled: modalOpen && isAuthenticated,
    staleTime: 1000 * 60 * 60,
  });

  const deliveryTree = useMemo(
    () => (zonesData ? deliveryZonesToNestedOptions(zonesData) : []),
    [zonesData]
  );

  // Use store first, then query cache so we don't show loading when we have cached data on reload
  const addressesToShow = addresses.length > 0 ? addresses : (queryAddresses ?? []);

  useEffect(() => {
    if (!modalOpen || !isAuthenticated) return;
    queryClient.invalidateQueries({ queryKey: globalQueryKeys.customerAddresses });
  }, [modalOpen, isAuthenticated, queryClient]);

  useEffect(() => {
    if (!modalOpen || !addressesError) return;
    const message = addressesError instanceof Error ? addressesError.message : "Failed to load addresses";
    toast.error(message);
    if (message.toLowerCase().includes("log in")) {
      closeAddressModal();
    }
  }, [modalOpen, addressesError, closeAddressModal]);

  useEffect(() => {
    if (!modalOpen || !zonesError) return;
    const message =
      zonesError instanceof Error ? zonesError.message : "Failed to load delivery areas";
    toast.error(message);
  }, [modalOpen, zonesError]);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      deliveryArea: "",
      address: "",
      addressType: "home",
      isDefault: false,
    },
  });

  const editingAddress = editingAddressId
    ? addressesToShow.find((a) => a.id === editingAddressId)
    : null;

  useEffect(() => {
    if (!formOpen) return;
    if (editingAddressId && editingAddress) {
      const path =
        zonesData && editingAddress.city
          ? findDeliveryPathForAddress(
              zonesData,
              editingAddress.city,
              editingAddress.deliveryArea
            )
          : null;
      form.reset({
        fullName: editingAddress.fullName,
        phone: editingAddress.phone,
        deliveryArea: path ?? editingAddress.deliveryArea,
        address: editingAddress.address,
        addressType: editingAddress.addressType,
        isDefault: editingAddress.isDefault,
      });
    } else {
      form.reset({
        fullName: "",
        phone: "",
        deliveryArea: "",
        address: "",
        addressType: "home",
        isDefault: false,
      });
    }
    // Intentionally omit editingAddress to avoid resetting when store reference changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formOpen, editingAddressId, editingAddress?.id, form, zonesData]);

  const onSubmit = async (data: AddressFormValues) => {
    const { city, area } = getCityAreaFromDeliveryPath(data.deliveryArea);
    const payload = formToCreatePayload(data, city, area);

    if (editingAddressId) {
      const numId = parseInt(editingAddressId, 10);
      if (Number.isNaN(numId)) {
        toast.error("Invalid address");
        return;
      }
      try {
        const updated = await updateAddress(numId, payload);
        if (data.isDefault) {
          await setDefaultAddressApi(updated.id);
        }
        queryClient.invalidateQueries({ queryKey: globalQueryKeys.customerAddresses });
        const mapped = apiAddressToStore(updated);
        const nextList = addressesToShow.map((a) => (a.id === mapped.id ? mapped : a));
        setAddresses(nextList);
        if (data.isDefault) {
          setDefaultAddress(mapped.id);
          setSelectedAddress(mapped.id);
        }
        closeForm();
        toast.success("Address updated");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update address";
        toast.error(message);
      }
      return;
    }

    try {
      const added = await addAddress(payload);
      if (data.isDefault) {
        await setDefaultAddressApi(added.id);
      }
      queryClient.invalidateQueries({ queryKey: globalQueryKeys.customerAddresses });
      closeForm();
      toast.success("Address saved");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save address";
      toast.error(message);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      closeAddressModal();
    }
  };

  const handleSetDefault = async (id: string) => {
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) return;
    try {
      await setDefaultAddressApi(numId);
      queryClient.invalidateQueries({ queryKey: globalQueryKeys.customerAddresses });
      setDefaultAddress(id);
      setSelectedAddress(id);
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
    <Dialog open={modalOpen} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="rounded-xl w-full max-w-[min(100vw-2rem,28rem)]"
      >
        <div className="relative">
          {formOpen ? (
            <>
              <DialogHeader className="pb-2 flex flex-row justify-between items-center w-full">
                <div className="flex gap-4 items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-auto px-0"
                    onClick={closeForm}
                    aria-label="Back to address list"
                  >
                    <ArrowLeft className="size-5" />
                  </Button>
                  <DialogTitle className="text-xl">
                    {editingAddressId ? "Edit Shipping Address" : "Add Shipping Address"}
                  </DialogTitle>
                </div>
                <DialogClose
                  className="rounded-md opacity-70 hover:opacity-100 transition-opacity focus:outline-none flex items-center justify-center size-8 outline-none focus:ring-0 shrink-0 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="size-5" />
                </DialogClose>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4 mt-2"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter phone number"
                            type="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliveryArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Delivery Area *</FormLabel>
                        <FormControl>
                          <NestedSelect
                            options={deliveryTree}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder={
                              zonesLoading
                                ? "Loading delivery areas…"
                                : "Select delivery area"
                            }
                            searchPlaceholder="Search…"
                            emptyMessage={
                              zonesLoading
                                ? "Loading…"
                                : zonesError
                                  ? "Could not load areas."
                                  : "No area found."
                            }
                            disabled={zonesLoading || Boolean(zonesError)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Type House, Flat No, Road"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Type *</FormLabel>
                        <FormControl>
                          <div className="flex gap-2 flex-wrap">
                            {ADDRESS_TYPE_OPTIONS.map((opt) => {
                              const Icon = opt.icon;
                              return (
                                <Button
                                  key={opt.value}
                                  type="button"
                                  variant={
                                    field.value === opt.value
                                      ? "default"
                                      : "outline"
                                  }
                                  className={cn(
                                    "flex items-center gap-2",
                                    field.value === opt.value &&
                                    "bg-primary hover:bg-primary-dark"
                                  )}
                                  onClick={() =>
                                    form.setValue("addressType", opt.value)
                                  }
                                >
                                  <Icon className="size-4" />
                                  {opt.label}
                                </Button>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <FormLabel className="text-base">
                          Make default address
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark mt-2"
                  >
                    Save
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <>
              <DialogHeader className="flex flex-row justify-between items-center w-full">
                <DialogTitle className="text-xl">Address</DialogTitle>
                <DialogClose
                  className="rounded-md opacity-70 hover:opacity-100 transition-opacity focus:outline-none flex items-center justify-center size-8 outline-none focus:ring-0 shrink-0 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="size-5" />
                </DialogClose>
              </DialogHeader>
              <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto overflow-x-hidden min-w-0">
                {addressesLoading ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="size-8 animate-spin" aria-hidden />
                  </div>
                ) : addressesToShow.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No addresses yet. Add one to get started.
                  </p>
                ) : (
                  addressesToShow.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      address={addr}
                      isSelected={selectedAddress?.id === addr.id}
                      onSetDefault={() => handleSetDefault(addr.id)}
                      onEdit={() => openEditForm(addr.id)}
                      onDelete={() => handleDelete(addr.id)}
                    />
                  ))
                )}
              </div>
              <Button
                type="button"
                className="w-full bg-primary hover:bg-primary-dark mt-4"
                onClick={openAddForm}
              >
                Add New Address
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
