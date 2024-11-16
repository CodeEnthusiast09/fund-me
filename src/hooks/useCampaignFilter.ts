import { DataCampaignFilter } from "interfaces";
import { DEFAULT_CAMPAIGN_FILTERS } from "lib/constants";
import { useState } from "react";

export const useCampaignFilter = () => {
  const [campaignFilter, setCampaignFilter] = useState<DataCampaignFilter>(
    DEFAULT_CAMPAIGN_FILTERS
  );

  const handleSearch = (keyword: string) => {
    setCampaignFilter((prev) => ({
      ...prev,
      search: keyword.trim(),
    }));
  };
  return { campaignFilter, handleSearch };
};
