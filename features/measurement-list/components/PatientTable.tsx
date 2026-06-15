import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Monitor, Circle, CheckCircle2 } from "lucide-react";
import { Patient } from "../types";
import Link from "next/link";

const mockPatients: Patient[] = [
  { id: "1", name: "Budi Santoso", patientId: "SUBJ-2026-0144", room: "ICU - 01", status: "Ready for Analysis", brand: "Brand A" },
  { id: "2", name: "Siti Aminah", patientId: "SUBJ-2026-0145", room: "ICU - 02", status: "In Cycle", brand: "Brand B" },
  { id: "3", name: "John Doe", patientId: "SUBJ-2026-0146", room: "ICU - 03", status: "Completed", brand: "Brand B" },
  { id: "4", name: "Charlie Watt", patientId: "SUBJ-2026-0147", room: "ICU - 04", status: "Completed", brand: "Brand A" },
];

export function PatientTable() {
  const renderStatus = (status: Patient["status"]) => {
    switch (status) {
      case "Ready for Analysis":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E4E6] bg-[#FAFAFA] px-2.5 py-1 text-sm font-medium text-[#595F6A]">
            <Circle className="h-2 w-2 fill-current" /> Ready for Analysis
          </span>
        );
      case "In Cycle":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C4EAEE] bg-[#F1F9FA] px-2.5 py-1 text-sm font-medium text-[#0076D2]">
            <Circle className="h-2 w-2 fill-current" /> In Cycle
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9EBDE] bg-[#EEF8F4] px-2.5 py-1 text-sm font-medium text-[#4BAC87]">
            <CheckCircle2 className="h-3 w-3" /> Completed
          </span>
        );
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 px-16 pb-16">
      <div className="flex flex-col gap-2 pb-4">
        <div className="flex items-center gap-6">
          <h2 className="text-[28px] font-bold text-[#2D2F35]">Patient List</h2>
          <div className="flex-1 h-px bg-[#E2E4E6]" />
        </div>
        <p className="text-base text-[#707784] font-light">
          Manage and monitor all registered patients.
        </p>
      </div>

    <div className="rounded-lg bg-transparent">
        <Table className="border-separate border-spacing-y-3">
          <TableHeader>
            <TableRow className="border-0 bg-[#F1F9FA] hover:bg-[#F1F9FA]">
              <TableHead className="rounded-l-lg py-4 text-base font-semibold text-[#0076D2]">Patient Name</TableHead>
              <TableHead className="py-4 text-base font-semibold text-[#0076D2]">Patient ID</TableHead>
              <TableHead className="py-4 text-base font-semibold text-[#0076D2]">Room</TableHead>
              <TableHead className="py-4 text-base font-semibold text-[#0076D2]">Status</TableHead>
              <TableHead className="py-4 text-base font-semibold text-[#0076D2]">Insulin Brand</TableHead>
              <TableHead className="rounded-r-lg py-4 text-base font-semibold text-[#0076D2]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPatients.map((patient) => (
              <TableRow key={patient.id} className="border-0 bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.05)] hover:bg-gray-50">
                <TableCell className="rounded-l-lg py-5 text-base text-[#212121]">{patient.name}</TableCell>
                <TableCell className="py-5 text-base text-[#212121]">{patient.patientId}</TableCell>
                <TableCell className="py-5 text-base text-[#212121]">{patient.room}</TableCell>
                <TableCell className="py-5">{renderStatus(patient.status)}</TableCell>
                <TableCell className="py-5 text-base text-[#212121]">{patient.brand}</TableCell>
                <TableCell className="rounded-r-lg py-5">
                  <Button variant="secondary" asChild className="h-8 rounded-full bg-[#DBF2F3] text-xs font-medium text-[#0076D2] hover:bg-[#c6eaec]">
                    <Link href={`/measurement/${patient.id}`}>
                      Monitor
                      <Monitor className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2 text-sm text-[#707784]">
          Show from 1 to 10
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-[#A9ADB5]" disabled>
             <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="secondary" className="h-9 w-9 rounded-full bg-[#DBF2F3] text-base font-medium text-[#0076D2] hover:bg-[#DBF2F3]">1</Button>
          <Button variant="ghost" className="h-9 w-9 rounded-full text-base font-medium text-[#A9ADB5]">2</Button>
          <Button variant="ghost" className="h-9 w-9 rounded-full text-base font-medium text-[#A9ADB5]">3</Button>
          <span className="px-2 text-[#A9ADB5]">...</span>
          <Button variant="ghost" className="h-9 w-9 rounded-full text-base font-medium text-[#A9ADB5]">6</Button>
          <Button variant="ghost" size="icon" className="text-[#A9ADB5]">
             <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}