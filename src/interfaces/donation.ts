import { Base } from "./global";

export interface Donation extends Base {
  campaignId: string;
  firstName: string;
  lastName: string;
  currencyCode: string;
  amount: number;
}

export interface MyDonation extends Donation {
  campaign: {
    id: string;
    title: string;
    headerImage: string;
  };
}
