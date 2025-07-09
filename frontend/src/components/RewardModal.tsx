import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RewardModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddressFormData) => void;
}

export interface AddressFormData {
  full_name: string;
  street_address: string;
  postal_code: string;
  city: string;
  state?: string;
  phone_number: string;
}

const RewardModal: React.FC<RewardModalProps> = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState<AddressFormData>({
    full_name: "",
    street_address: "",
    postal_code: "",
    city: "",
    state: "",
    phone_number: "",
  });

  const handleChange = (field: keyof AddressFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = () => {
    if (!form.full_name || !form.street_address || !form.postal_code || !form.city || !form.phone_number) {
      alert("Please fill out all required fields.");
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Shipping Address</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input placeholder="Full Name *" value={form.full_name} onChange={e => handleChange("full_name", e.target.value)} />
          <Input placeholder="Street Address *" value={form.street_address} onChange={e => handleChange("street_address", e.target.value)} />
          <Input placeholder="Postal Code *" value={form.postal_code} onChange={e => handleChange("postal_code", e.target.value)} />
          <Input placeholder="City *" value={form.city} onChange={e => handleChange("city", e.target.value)} />
          <Input placeholder="State (optional)" value={form.state} onChange={e => handleChange("state", e.target.value)} />
          <Input placeholder="Phone Number *" value={form.phone_number} onChange={e => handleChange("phone_number", e.target.value)} />
          <Button className="w-full mt-2" onClick={handleFormSubmit}>
            Claim Gift
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RewardModal;
