import { useState, type FormEvent } from "react";

import { useUpdatePatient } from "../hooks/useUpdatePatient";
import type {
    Patient,
    PatientGender,
} from "../patients.type";

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

export default function EditPatientDialog({ patient }: { patient: Patient }) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState(patient.full_name);
  const [phone, setPhone] = useState(patient.phone ?? "");
  const [email, setEmail] = useState(patient.email ?? "");
  const [dateOfBirth, setDateOfBirth] = useState( patient.date_of_birth ?? "", );
  const [gender, setGender] = useState<PatientGender | "">( patient.gender ?? "", );
  const [notes, setNotes] = useState(patient.notes ?? "");

  const updatePatient = useUpdatePatient();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updatePatient.mutate(
      {
        clinicId: patient.clinic_id,
        patientId: patient.id,
        values: {
          fullName,
          phone,
          email,
          dateOfBirth,
          gender: gender || null,
          notes,
        },
      },
      {
        onSuccess: () => setOpen(false),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button variant="outline">Edit patient</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit patient details</DialogTitle>
          <DialogDescription>
            Update the patient’s information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-patient-name">Full name</Label>
            <Input
              id="edit-patient-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-patient-phone">Phone</Label>
              <Input
                id="edit-patient-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-patient-email">Email</Label>
              <Input
                id="edit-patient-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-patient-birth">Date of birth</Label>
              <Input
                id="edit-patient-birth"
                type="date"
                value={dateOfBirth}
                onChange={(event) => setDateOfBirth(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-patient-gender">Gender</Label>
              <Select
                value={gender}
                onValueChange={(value) =>
                  setGender(value as PatientGender)
                }
              >
                <SelectTrigger id="edit-patient-gender">
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
            <Label htmlFor="edit-patient-notes">Notes</Label>
            <Textarea
              id="edit-patient-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
            />
          </div>

          {updatePatient.isError && (
            <p className="text-sm text-destructive" role="alert">
              {updatePatient.error.message}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={updatePatient.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updatePatient.isPending}>
              {updatePatient.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}