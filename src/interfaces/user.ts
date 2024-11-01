import { Base } from "./global";

export interface User extends Base {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
}
