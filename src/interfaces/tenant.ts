import { Base } from "./global";

export interface Tenant extends Base {
  slug: string;
  name: string;
}

export interface DocumentTypes extends Base {
  name: string;
}
