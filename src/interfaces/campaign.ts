import { Base } from "./global";

export interface Campaign extends Base {
  title: string;
  headerImage: string;
  description: string;
  story: string;
  goal: number;
  deadline?: string;
  category: string[];
  socialMediaLinks: string[];
  amountRaised: number;
  donorCount: number;
}
