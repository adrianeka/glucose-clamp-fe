export type ParticipantStatus = "Active" | "Inactive";

export interface Participant {
  id: string;
  medicalRecord: string;
  name: string;
  gender: "Male" | "Female";
  dob: string;
  phone: string;
  status: ParticipantStatus;
}

export const PARTICIPANTS: Participant[] = [
  {
    id: "PAT001",
    medicalRecord: "MR889100",
    name: "Adrian Saputra",
    gender: "Male",
    dob: "1998-06-10",
    phone: "8123456789",
    status: "Active",
  },
  {
    id: "PAT002",
    medicalRecord: "MR889101",
    name: "Lisa Wong",
    gender: "Female",
    dob: "1995-04-22",
    phone: "8123456790",
    status: "Active",
  },
  {
    id: "PAT003",
    medicalRecord: "MR889102",
    name: "Carlos Mendez",
    gender: "Male",
    dob: "1988-11-15",
    phone: "8123456791",
    status: "Inactive",
  },
  {
    id: "PAT004",
    medicalRecord: "MR889103",
    name: "Aisha Khan",
    gender: "Female",
    dob: "1992-03-22",
    phone: "9123456782",
    status: "Inactive",
  },
  {
    id: "PAT005",
    medicalRecord: "MR889104",
    name: "James Smith",
    gender: "Male",
    dob: "1985-07-30",
    phone: "8123456783",
    status: "Active",
  },
  {
    id: "PAT006",
    medicalRecord: "MR889105",
    name: "Emily Johnson",
    gender: "Female",
    dob: "1990-05-12",
    phone: "9123456784",
    status: "Active",
  },
];

export const NAV_ITEMS = [
  {
    label: "Participant Management",
    href: "/participant-management",
    active: true,
  },
  {
    label: "Global Configuration",
    href: "/global-configuration",
    active: false,
  },
  {
    label: "Phase Management",
    href: "/phase-management",
    active: false,
  },
  {
    label: "Protocol & Sampling",
    href: "/protocol-sampling",
    active: false,
    hasChevron: true,
    children: ["Protocol Setup", "Sampling Schedule Mapper"],
  },
  {
    label: "Session Creation",
    href: "/session-creation",
    active: false,
  },
];
