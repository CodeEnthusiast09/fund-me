import { Base } from "./global";

export interface User extends Base {
  employeeId?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  image?: string;
}

export interface Role extends Base {
  name: string;
  description?: string;
  permissions?: Permission[];
  users?: User[];
}

export interface Permission extends Base {
  name: string;
}
