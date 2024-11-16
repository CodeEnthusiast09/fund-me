import { DataCampaignFilter, DataTableFilter } from "interfaces";
import { ToasterProps } from "react-hot-toast";

export const TOASTER_PROPS: ToasterProps = {
  position: "top-right",
  toastOptions: {
    style: {
      fontSize: "0.875rem",
    },
    duration: 4000,
    success: {
      style: {
        backgroundColor: "#DCFCE7",
        color: "#14532D",
      },
    },
  },
};

export const DEFAULT_TABLE_FILTERS: DataTableFilter = {
  limit: 10,
  page: 1,
  order: "desc",
  search: "",
};


export const DEFAULT_CAMPAIGN_FILTERS: DataCampaignFilter = {
  limit: 6,
  order: "desc",
  search: "",
};
