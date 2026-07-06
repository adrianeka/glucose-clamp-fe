export interface RoleAccess {
  roleAccessId?: number;
  roleId: number;
  roleName: string;
  menuId: number;
  menuName: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export type ActionType = "canView" | "canAdd" | "canEdit" | "canDelete";

export interface MatrixRow {
  menuId: number;
  menuName: string;
  action: ActionType;
  actionLabel: "View" | "Add" | "Edit" | "Delete";
  roles: {
    [roleName: string]: {
      roleId: number;
      roleAccessId?: number;
      allowed: boolean;
    };
  };
}