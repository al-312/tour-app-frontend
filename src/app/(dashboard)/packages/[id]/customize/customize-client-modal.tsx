"use client";

import * as React from "react";
import { UserPlus } from "lucide-react";

import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";

interface CustomizeClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (clientId: string) => void;
  createClient: (data: {
    name: string;
    email?: string;
    phone?: string;
    country?: string;
    address?: string;
    passportNumber?: string;
  }) => { unwrap: () => Promise<{ id: string }> };
  isCreatingClient: boolean;
  onSetErrorMessage: (msg: string) => void;
}

export function CustomizeClientModal({
  isOpen,
  onClose,
  onClientCreated,
  createClient,
  isCreatingClient,
  onSetErrorMessage,
}: CustomizeClientModalProps): React.JSX.Element {
  const [newClientName, setNewClientName] = React.useState("");
  const [newClientEmail, setNewClientEmail] = React.useState("");
  const [newClientPhone, setNewClientPhone] = React.useState("");
  const [newClientCountry, setNewClientCountry] = React.useState("US");
  const [newClientAddress, setNewClientAddress] = React.useState("");
  const [newClientPassport, setNewClientPassport] = React.useState("");

  const handleCreateClient = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();
    try {
      const created = await createClient({
        name: newClientName,
        email: newClientEmail,
        phone: newClientPhone,
        country: newClientCountry,
        address: newClientAddress,
        passportNumber: newClientPassport,
      }).unwrap();

      onClientCreated(created.id);
      onClose();
      setNewClientName("");
      setNewClientEmail("");
      setNewClientPhone("");
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } } | undefined;
      onSetErrorMessage(apiErr?.data?.message ?? "Failed to create client.");
    }
  };

  return (
    <Modal title="Create Client Profile" isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-w-md w-full">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-app-brand" />
          <h3 className="text-base font-bold text-app-fg font-display-md">
            Create Client Profile
          </h3>
        </div>
        <form
          onSubmit={(e): void => {
            void handleCreateClient(e);
          }}
          className="flex flex-col gap-3.5"
        >
          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1">
              Full Name *
            </label>
            <Input
              type="text"
              placeholder="e.g. Alice Smith"
              value={newClientName}
              onChange={(e): void => {
                setNewClientName(e.target.value);
              }}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1">Email</label>
            <Input
              type="email"
              placeholder="alice@example.com"
              value={newClientEmail}
              onChange={(e): void => {
                setNewClientEmail(e.target.value);
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1">Phone</label>
            <Input
              type="text"
              placeholder="+1-555-123456"
              value={newClientPhone}
              onChange={(e): void => {
                setNewClientPhone(e.target.value);
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1">
              Country
            </label>
            <Input
              type="text"
              placeholder="United States"
              value={newClientCountry}
              onChange={(e): void => {
                setNewClientCountry(e.target.value);
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1">
              Address
            </label>
            <Input
              type="text"
              placeholder="Address"
              value={newClientAddress}
              onChange={(e): void => {
                setNewClientAddress(e.target.value);
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-app-fg mb-1">
              Passport Number (Optional)
            </label>
            <Input
              type="text"
              placeholder="Passport Number"
              value={newClientPassport}
              onChange={(e): void => {
                setNewClientPassport(e.target.value);
              }}
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatingClient}>
              {isCreatingClient ? "Saving..." : "Create Client"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
