"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Mail,
  Calendar,
  Hash,
  Briefcase,
} from "lucide-react";

import { UserManagementResponse } from "../types/user";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: UserManagementResponse;
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[48%_52%] min-h-13 border-b last:border-b-0 py-2 sm:py-0">
      <div className="flex items-center gap-2 px-4 sm:border-r text-sm text-gray-600">
        {icon}
        <span>{label}</span>
      </div>

      <div className="flex items-center px-4 text-sm text-gray-900 mt-1 sm:mt-0 break-all">
        {value}
      </div>
    </div>
  );
}

export default function ModalViewUser({
  open,
  onOpenChange,
  data,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
            w-[95vw]
            max-w-[560px]
            sm:max-w-[560px]
            p-0
            gap-0
            overflow-y-auto
            max-h-[90vh]
            rounded-xl

            [&>button]:text-white
            [&>button]:opacity-100
            [&>button]:top-4
            [&>button]:right-4
            [&>button:hover]:bg-transparent
            [&>button:hover]:text-white
        "
        >
        <DialogTitle className="sr-only">
            User Detail - {data.name}
        </DialogTitle>
        {/* HEADER */}

        <div className="bg-[#0076D2] text-white px-6 py-4 pr-12">
          <p className="text-xs">
            User Detail
          </p>

          <h2 className="text-[20px] sm:text-[22px] font-semibold mt-1">
            {data.name}
          </h2>
        </div>

        {/* CONTENT */}

        <div className="p-4 sm:p-6 space-y-5 bg-white">

          {/* MEDICAL IDENTITY */}

          <div>
            <h3 className="text-sm text-muted-foreground mb-2">
              Medical Identity
            </h3>

            <Card className="rounded-md shadow-none p-0">
              <CardContent className="p-0">
                <DetailRow
                  icon={
                    <Hash
                      size={14}
                      className="text-gray-400"
                    />
                  }
                  label="User ID"
                  value={data.userId}
                />
              </CardContent>
            </Card>
          </div>

          {/* PERSONAL DATA */}

          <div>
            <h3 className="text-sm text-muted-foreground mb-2">
              Personal Data
            </h3>

            <Card className="rounded-md shadow-none p-0">
              <CardContent className="p-0">
                <DetailRow
                  icon={
                    <Briefcase
                      size={14}
                      className="text-gray-400"
                    />
                  }
                  label="Position"
                  value={data.positionName}
                />

                <DetailRow
                  icon={
                    <Mail
                      size={14}
                      className="text-gray-400"
                    />
                  }
                  label="Email"
                  value={data.email}
                />
              </CardContent>
            </Card>
          </div>

          {/* AUDIT TRAIL */}

          <div>
            <h3 className="text-sm text-muted-foreground mb-2">
              Audit Trail
            </h3>

            <Card className="rounded-md shadow-none p-0">
              <CardContent className="p-0">
                <DetailRow
                  label="Status"
                  value={
                    <Badge
                      variant="outline"
                      className={
                        data.status === "ACTIVE"
                          ? "text-green-600 border-green-400 bg-green-50"
                          : "text-red-600 border-red-400 bg-red-50"
                      }
                    >
                      {data.status}
                    </Badge>
                  }
                />

                <DetailRow
                  icon={
                    <Calendar
                      size={14}
                      className="text-gray-400"
                    />
                  }
                  label="Created at"
                  value={data.createdAt}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}