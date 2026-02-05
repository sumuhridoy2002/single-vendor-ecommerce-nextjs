"use client";

import { Badge } from "@/components/ui/badge";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectMenu } from "@/components/ui/select-menu";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useAddressStore, type Address, type AddressType } from "@/store/address-store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Home,
  MoreVertical,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const DELIVERY_AREAS = [
  { value: "dhaka", label: "Dhaka City" },
  { value: "chittagong", label: "Chittagong" },
  { value: "sylhet", label: "Sylhet" },
  { value: "outside_dhaka", label: "Outside Dhaka" },
  { value: "other", label: "Other" },
] as const;

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

function AddressTypeIcon({ type }: { type: AddressType }) {
  const opt = ADDRESS_TYPE_OPTIONS.find((o) => o.value === type);
  const Icon = opt?.icon ?? Home;
  return <Icon className="size-5 text-teal-600" aria-hidden />;
}

function AddressTypeLabel(type: AddressType): string {
  const labels: Record<AddressType, string> = {
    home: "Home Address",
    office: "Office Address",
    hometown: "Hometown Address",
  };
  return labels[type];
}

export function AddressModal() {
  const {
    modalOpen,
    formOpen,
    editingAddressId,
    addresses,
    closeAddressModal,
    openAddForm,
    openEditForm,
    closeForm,
    saveAddress,
    setDefaultAddress,
    deleteAddress,
  } = useAddressStore();

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
    ? addresses.find((a) => a.id === editingAddressId)
    : null;

  useEffect(() => {
    if (!formOpen) return;
    if (editingAddressId && editingAddress) {
      form.reset({
        fullName: editingAddress.fullName,
        phone: editingAddress.phone,
        deliveryArea: editingAddress.deliveryArea,
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
  }, [formOpen, editingAddressId, editingAddress?.id, form]);

  const onSubmit = (data: AddressFormValues) => {
    saveAddress({
      fullName: data.fullName,
      phone: data.phone,
      deliveryArea: data.deliveryArea,
      address: data.address,
      addressType: data.addressType,
      isDefault: data.isDefault,
    });
    toast.success(editingAddressId ? "Address updated" : "Address saved");
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      closeAddressModal();
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden rounded-xl"
      >
        <div className="relative">
          {formOpen ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-0 top-0 -ml-2"
                onClick={closeForm}
                aria-label="Back to address list"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <DialogHeader className="pr-8 pb-2">
                <DialogTitle className="text-xl">
                  {editingAddressId ? "Edit Shipping Address" : "Add Shipping Address"}
                </DialogTitle>
              </DialogHeader>
              <DialogClose
                className="absolute right-0 top-0 rounded-md opacity-70 hover:opacity-100 transition-opacity focus:ring-2 focus:ring-offset-2 focus:outline-none"
                aria-label="Close"
              />
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
                          <SelectMenu
                            items={DELIVERY_AREAS.map((a) => ({
                              value: a.value,
                              label: a.label,
                            }))}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select delivery area"
                            searchPlaceholder="Search area"
                            emptyMessage="No area found."
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
                                    "bg-teal-600 hover:bg-teal-700"
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
                    className="w-full bg-teal-600 hover:bg-teal-700 mt-2"
                  >
                    Save
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <>
              <DialogHeader className="pr-8">
                <DialogTitle className="text-xl">Address</DialogTitle>
              </DialogHeader>
              <DialogClose
                className="absolute right-0 top-0 rounded-md opacity-70 hover:opacity-100 transition-opacity focus:ring-2 focus:ring-offset-2 focus:outline-none"
                aria-label="Close"
              />
              <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {addresses.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No addresses yet. Add one to get started.
                  </p>
                ) : (
                  addresses.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      address={addr}
                      onEdit={() => openEditForm(addr.id)}
                      onSetDefault={() => setDefaultAddress(addr.id)}
                      onDelete={() => {
                        deleteAddress(addr.id);
                        toast.success("Address removed");
                      }}
                    />
                  ))
                )}
              </div>
              <Button
                type="button"
                className="w-full bg-teal-600 hover:bg-teal-700 mt-4"
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

function AddressCard({
  address,
  onEdit,
  onSetDefault,
  onDelete,
}: {
  address: Address;
  onEdit: () => void;
  onSetDefault: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4 flex gap-3">
      <div className="shrink-0 pt-0.5">
        <AddressTypeIcon type={address.addressType} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="font-medium">{AddressTypeLabel(address.addressType)}</span>
            {address.isDefault && (
              <Badge className="ml-2 bg-green-600 hover:bg-green-600">
                Default (Shipping Address)
              </Badge>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                aria-label="Address options"
              >
                <MoreVertical className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-2">
              <div className="flex flex-col gap-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                  onClick={onEdit}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                  onClick={onSetDefault}
                >
                  Make Default
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={onDelete}
                >
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <p className="text-sm text-muted-foreground mt-1 truncate">
          {address.fullName}
        </p>
        <p className="text-sm text-muted-foreground truncate">{address.phone}</p>
        <p className="text-sm text-muted-foreground truncate mt-0.5">
          {address.address}
          {address.deliveryArea ? `, ${address.deliveryArea}` : ""}
        </p>
      </div>
    </div>
  );
}
