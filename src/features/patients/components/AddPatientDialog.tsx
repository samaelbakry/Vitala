import { useState, type FormEvent } from "react";

import { useCreatePatient } from "../hooks/useCreatePatient";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PatientGender } from "../patients.type";
import { Plus } from "lucide-react";

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  gender: "" as PatientGender | "",
  notes: "",
};

export default function AddPatientDialog({ clinicId }: { clinicId: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const createPatient = useCreatePatient();

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createPatient.mutate(
      {
        clinicId,
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender || null,
        notes: form.notes,
      },
      {
        onSuccess: () => {
          setForm(initialForm);
          setOpen(false);
        },
      },
    );
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      createPatient.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button
          size={"lg"}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-[13px] font-medium text-foreground shadow-sm transition-all hover:border-brand-300/60 hover:bg-accent hover:text-accent-foreground"
        >
          <Plus size={16} strokeWidth={1.7} />
          Add patient
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add new patient</DialogTitle>
          <DialogDescription>
            Enter the patient’s details. Only the full name is required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient-full-name">Full name</Label>
            <Input
              id="patient-full-name"
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="Enter full name"
              required
              autoFocus
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="patient-phone">Phone</Label>
              <Input
                id="patient-phone"
                type="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="Phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient-email">Email</Label>
              <Input
                id="patient-email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="patient-date-of-birth">Date of birth</Label>
              <Input
                id="patient-date-of-birth"
                type="date"
                value={form.dateOfBirth}
                onChange={(event) =>
                  updateField("dateOfBirth", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient-gender">Gender</Label>
              <Select
                value={form.gender}
                onValueChange={(value) =>
                  updateField("gender", value as PatientGender)
                }
              >
                <SelectTrigger id="patient-gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient-notes">Notes</Label>
            <Textarea
              id="patient-notes"
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Additional patient information"
              rows={3}
            />
          </div>

          {createPatient.isError && (
            <p className="text-sm text-destructive" role="alert">
              {createPatient.error.message}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createPatient.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createPatient.isPending}>
              {createPatient.isPending ? "Adding..." : "Add patient"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
