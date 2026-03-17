"use client";

import { PhoneVerifyDialog } from "@/components/account/PhoneVerifyDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "@/lib/api/customer";
import { cn } from "@/lib/utils";
import { Camera, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function formatDateOfBirth(date: Date | undefined): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export default function ProfilePage() {
  const { user, updateUser, refetchUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [mobile, setMobile] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user?.name, user?.email]);

  const initials = (name || (user?.name ?? ""))
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      setAvatarPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setAvatarPreviewUrl(null);
  }, [avatarFile]);

  const avatarPreview = avatarPreviewUrl ?? user?.avatar;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const data = await updateProfile({
        name: name.trim(),
        email: email.trim(),
        avatar: avatarFile ?? undefined,
      });
      updateUser(data);
      setAvatarFile(null);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleVerifyMobile = () => {
    if (!mobile.trim()) {
      toast.error("Please enter your mobile number");
      return;
    }
    setVerifyDialogOpen(true);
  };

  return (
    <div className="container max-w-2xl py-3 xs:py-6 md:py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">View Profile</h1>

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        {/* Profile picture */}
        <div className="flex flex-col items-start gap-4">
          <div className="relative">
            <Avatar className="size-24 md:size-28">
              {avatarPreview && (
                <AvatarImage src={avatarPreview} alt={name || "Profile"} />
              )}
              <AvatarFallback className="text-2xl text-muted-foreground">
                {initials || "?"}
              </AvatarFallback>
            </Avatar>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setAvatarFile(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              aria-label="Change profile picture"
              className={cn(
                "absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full",
                "bg-muted border-2 border-background text-muted-foreground",
                "hover:bg-muted/80 transition-colors"
              )}
              onClick={() => avatarInputRef.current?.click()}
            >
              <Camera className="size-4" />
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        {/* Gender */}
        {/* <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        {/* Date of Birth */}
        {/* <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dob"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateOfBirth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {dateOfBirth ? formatDateOfBirth(dateOfBirth) : "mm/dd/yyyy"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateOfBirth}
                onSelect={setDateOfBirth}
                initialFocus
                defaultMonth={dateOfBirth}
              />
            </PopoverContent>
          </Popover>
        </div> */}

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="pr-10"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"
              aria-label="Verified"
            >
              <Check className="size-5" />
            </span>
          </div>
        </div>

        {/* Mobile - only for guest users */}
        {user?.guest_user && (
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile No</Label>
            <div className="flex gap-2">
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter mobile no"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={handleVerifyMobile}>
                Verify
              </Button>
            </div>
            <p className="text-sm text-primary">
              Please verify account phone number for one time to get cash on
              delivery.
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700"
          disabled={submitLoading}
        >
          {submitLoading ? "Updating…" : "Update Profile"}
        </Button>
      </form>

      <PhoneVerifyDialog
        open={verifyDialogOpen}
        onOpenChange={setVerifyDialogOpen}
        phone={mobile}
        onSuccess={refetchUser}
      />
    </div>
  );
}
