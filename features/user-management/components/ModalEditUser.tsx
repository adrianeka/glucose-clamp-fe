"use client";

import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useRoles,
  useEditUser,
} from "../hooks/UserManagementHook";
import { EditUserRequest, UserManagementResponse, Roles } from "../types/user";
import {
  Circle,
  CheckCircle2,
} from "lucide-react";

import { useToast } from "@/components/ui/toast";
import { X } from "lucide-react";

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: UserManagementResponse;
}

export default function ModalEditUser({
  open,
  onOpenChange,
  data,
}: EditUserModalProps) {
  const { data: rolesData } = useRoles({
    pageNumber: 1,
    pageSize: 100,
  });
  const [changePassword, setChangePassword] =
    useState(false);

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [repeatPassword, setRepeatPassword] = useState("");

  const EditUserMutation = useEditUser();

  const roles = rolesData?.data?.content ?? [];

  const { showToast } = useToast();

  const [form, setForm] = useState<EditUserRequest>({
    roleId: 0,
    positionName: "",
    name: "",
    username: "",
    email: "",
    status: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    roleId: "",
    positionName: "",
    name: "",
    username: "",
    email: "",
    status: "",
    password: "",
  });

  useEffect(() => {
    if (data && open) {
      setForm({
        roleId: data.roleId,
        positionName: data.positionName,
        name: data.name,
        username: data.username,
        email: data.email,
        status: data.status,
        password: "",
      });

      setConfirmPassword("");
      setChangePassword(false);
    }
  }, [data, open]);

  const validatePassword = (
    password: string
  ) => {
    return /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(
      password
    );
  };

  const validateForm = () => {
    const newErrors = {
      roleId: "",
      positionName: "",
      name: "",
      username: "",
      email: "",
      status: "",
      password: "",
    };

    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = "Full Name is required";
      isValid = false;
    }

    if (!form.roleId) {
      newErrors.roleId = "Role is required";
      isValid = false;
    }

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (form.username.includes(" ")) {
      newErrors.username = "Username cannot contain spaces";
      isValid = false;
    }

    if (!form.positionName) {
      newErrors.positionName =
        "Position is required";
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (form.email.trim()) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        newErrors.email = "Invalid email format";
        isValid = false;
      }
    }

    if (!form.status) {
      newErrors.status = "Status is required";
      isValid = false;
    }

    const password = form.password.trim();

    if (password.length > 0) {
      if (!validatePassword(password)) {
        newErrors.password =
          "Minimum 6 characters, uppercase and lowercase letters required";
        isValid = false;
      }
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      console.log("Validation failed");

      return;
    } 

    const payload = {
      ...form,
      password: changePassword
        ? form.password
        : "",
    };

    try {
      await EditUserMutation.mutateAsync({
        id: data.userId,
        data: payload,
      });

      setForm({
        roleId: 0,
        positionName: "",
        name: "",
        username: "",
        email: "",
        status: "",
        password: "",
      });

      setErrors({
        roleId: "",
        positionName: "",
        name: "",
        username: "",
        email: "",
        status: "",
        password: "",
      });

      setConfirmPassword("");
      setChangePassword(false);

      showToast("Edit user successfully");

      onOpenChange(false);
    } catch (error:any) {
      console.error(error);
      const message =
        error?.response?.data?.message ||
        "Failed to add user";

      showToast(message, "error");
    }
  };

  const hasMinLength =
    form.password.length >= 6;

  const hasLowercase =
    /[a-z]/.test(form.password);

  const hasUppercase =
    /[A-Z]/.test(form.password);

  const passwordMatch =
    form.password === repeatPassword &&
    repeatPassword.length > 0;

  const isPasswordValid =
    hasMinLength &&
    hasLowercase &&
    hasUppercase;

  const isFormReady =
    form.name.trim() &&
    form.positionName.trim() &&
    form.username.trim() &&
    form.email.trim() &&
    form.roleId &&
    isPasswordValid &&
    passwordMatch;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="w-140 max-w-140 sm:max-w-140 rounded-3xl p-0 overflow-hidden">
        <div className="p-8 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-[28px] font-bold">
              Edit User
            </DialogTitle>

            <DialogDescription>
              Follow the guided steps to
              complete the user data.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm text-[#595F6A]">
                Full Name
                <span className="text-red-500">
                  *
                </span>
              </label>

              <Input
                placeholder="John Doe"
                className={
                  errors.name
                    ? "border-red-500"
                    : ""
                }
                value={form.name}
                onChange={(e) => {
                  setForm({
                    ...form,
                    name: e.target.value,
                  });

                  setErrors({
                    ...errors,
                    name: "",
                  });
                }}
              />

              {errors.name && (
                <p className="text-xs text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Position */}
            <div className="space-y-2">
              <label className="text-sm text-[#595F6A]">
                  Position
                  <span className="text-red-500">*</span>
              </label>

              <Input
                  placeholder="Enter position"
                  className={
                  errors.positionName
                      ? "border-red-500"
                      : ""
                  }
                  value={form.positionName}
                  onChange={(e) => {
                  setForm({
                      ...form,
                      positionName: e.target.value,
                  });

                  setErrors({
                      ...errors,
                      positionName: "",
                  });
                  }}
              />

              {errors.positionName && (
                  <p className="text-xs text-red-500">
                  {errors.positionName}
                  </p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm text-[#595F6A]">
                Username
                <span className="text-red-500">
                  *
                </span>
              </label>

              <Input
                placeholder="johndoe"
                className={
                  errors.username
                    ? "border-red-500"
                    : ""
                }
                value={form.username}
                onChange={(e) => {
                  setForm({
                    ...form,
                    username:
                      e.target.value,
                  });

                  setErrors({
                    ...errors,
                    username: "",
                  });
                }}
              />

              {errors.username && (
                <p className="text-xs text-red-500">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm text-[#595F6A]">
                Email
                <span className="text-red-500">
                  *
                </span>
              </label>

              <Input
                type="email"
                placeholder="john@email.com"
                className={
                  errors.email
                    ? "border-red-500"
                    : ""
                }
                value={form.email}
                onChange={(e) => {
                  setForm({
                    ...form,
                    email: e.target.value,
                  });

                  setErrors({
                    ...errors,
                    email: "",
                  });
                }}
              />

              {errors.email && (
                <p className="text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm text-[#595F6A]">
                Status
                <span className="text-red-500">
                  *
                </span>
              </label>

              <Select
                value={form.status}
                onValueChange={(value) => {
                  setForm({
                    ...form,
                    status: value,
                  });

                  setErrors({
                    ...errors,
                    status: "",
                  });
                }}
              >
                <SelectTrigger
                  className={`w-full ${errors.status ? "border-red-500" : ""}`}
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ACTIVE">
                    Active
                  </SelectItem>

                  <SelectItem value="INACTIVE">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>

              {errors.status && (
                <p className="text-xs text-red-500">
                  {errors.status}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm text-[#595F6A]">
                Role
                <span className="text-red-500">
                  *
                </span>
              </label>

              <Select
                value={
                  form.roleId
                    ? form.roleId.toString()
                    : ""
                }
                onValueChange={(value) => {
                  const selectedRole =
                    roles.find(
                      (role: Roles) =>
                        role.roleId.toString() ===
                        value
                    );

                  if (!selectedRole) return;

                  setForm({
                    ...form,
                    roleId:
                      selectedRole.roleId,
                  });

                  setErrors({
                    ...errors,
                    roleId: "",
                  });
                }}
              >
                <SelectTrigger
                  className={`w-full ${errors.roleId ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>

                <SelectContent>
                  {roles.map(
                    (role: Roles) => (
                      <SelectItem
                        key={role.roleId}
                        value={role.roleId.toString()}
                      >
                        {role.roleName}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              {errors.roleId && (
                <p className="text-xs text-red-500">
                  {errors.roleId}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="col-span-2 space-y-3">
              <label className="text-sm text-[#595F6A]">
                Password
              </label>

              {!changePassword ? (
                <div className="flex items-start gap-3">
                  <Input
                    type="password"
                    value="********"
                    disabled
                    className="w-60 bg-gray-100 cursor-not-allowed"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setChangePassword(true);
                      setForm({
                        ...form,
                        password: "",
                      });
                    }}
                    className="border-[#0076D2] text-[#0076D2] hover:bg-[#DFF4F5] hover:text-[#0076D2] rounded-lg whitespace-nowrap"
                  >
                    Change Password
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-4 items-start">
                    {/* New Password */}
                    <div>
                      <label className="text-xs text-[#595F6A] mb-1 block">
                        New Password
                        <span className="text-red-500">*</span>
                      </label>

                      <Input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            password: e.target.value,
                          })
                        }
                      />

                      <div className="space-y-1 pt-1">
                        <div className="flex items-center gap-2 text-xs">
                          {hasMinLength ? (
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          ) : (
                            <Circle className="w-3 h-3 text-gray-400" />
                          )}

                          <span
                            className={
                              hasMinLength
                                ? "text-green-600"
                                : "text-gray-500"
                            }
                          >
                            Minimum 6 characters
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          {hasLowercase ? (
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          ) : (
                            <Circle className="w-3 h-3 text-gray-400" />
                          )}

                          <span
                            className={
                              hasLowercase
                                ? "text-green-600"
                                : "text-gray-500"
                            }
                          >
                            At least one lowercase letter (a-z)
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          {hasUppercase ? (
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          ) : (
                            <Circle className="w-3 h-3 text-gray-400" />
                          )}

                          <span
                            className={
                              hasUppercase
                                ? "text-green-600"
                                : "text-gray-500"
                            }
                          >
                            At least one uppercase letter (A-Z)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Repeat Password */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-[#595F6A] block">
                          Repeat Password
                          <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <Input
                        type="password"
                        placeholder="Repeat Password"
                        value={repeatPassword}
                        onChange={(e) =>
                          setRepeatPassword(e.target.value)
                        }
                      />

                      {repeatPassword && !passwordMatch && (
                        <p className="text-xs text-red-500">
                          Password does not match
                        </p>
                      )}

                      {passwordMatch && (
                        <p className="text-xs text-green-600">
                          Password matched
                        </p>
                      )}
                    </div>

                    <div className="pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setChangePassword(false);
                          setRepeatPassword("");
                          setForm({
                            ...form,
                            password: "",
                          });
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Cancel change password"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              className="bg-[rgb(213,234,255)] hover:bg-[#E2E4E6]/90 text-[hsl(221,98%,66%)] rounded-lg"
              variant="secondary"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={
                EditUserMutation.isPending ||
                (changePassword && !isFormReady)
              }
              className="
                bg-[#0076D2]
                w-20
                hover:bg-[#0076D2]/90
                text-white
                rounded-lg
                disabled:bg-gray-300
                disabled:text-white
              "
            >
              {EditUserMutation.isPending
                ? "Editing..."
                : "Edit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}