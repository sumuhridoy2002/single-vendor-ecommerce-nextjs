"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { CalendarIcon, Camera, Check } from "lucide-react";
import { useState } from "react";
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
  const { user } = useAuth();
  const [gender, setGender] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [mobile, setMobile] = useState("");

  const displayName = user?.name ?? "";
  const email = user?.email ?? "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully");
  };

  const handleVerifyMobile = () => {
    toast.info("Verification feature will be available soon.");
  };

  return (
    <div className="container max-w-2xl py-6 md:py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">View Profile</h1>

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        {/* Profile picture */}
        <div className="flex flex-col items-start gap-4">
          <div className="relative">
            <Avatar className="size-24 md:size-28">
              <AvatarFallback className="text-2xl text-muted-foreground">
                {initials || "?"}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              aria-label="Change profile picture"
              className={cn(
                "absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full",
                "bg-muted border-2 border-background text-muted-foreground",
                "hover:bg-muted/80 transition-colors"
              )}
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
            value={displayName}
            disabled
            readOnly
            className="bg-muted/50"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
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
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
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
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              readOnly
              className="bg-muted/50 pr-10"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"
              aria-label="Verified"
            >
              <Check className="size-5" />
            </span>
          </div>
        </div>

        {/* Mobile */}
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

        <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
          Update Profile
        </Button>
      </form>
    </div>
  );
}
