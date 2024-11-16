import { Base } from "./global";

export interface Campaign extends Base {
  title: string;
  headerImage: string;
  description: string;
  story: string;
  goal: string;
  deadline: string;
  category: string[];
  socialMediaLinks: string[];
}
