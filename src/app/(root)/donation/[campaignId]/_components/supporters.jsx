"use client";

import { useCampaignDonations } from "hooks";

const Supporters = ({ campaignId }) => {
  const { data: donations, isPending } = useCampaignDonations(campaignId);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">Supporters</h3>
      {isPending && <p className="text-gray-600">Loading supporters…</p>}
      {!isPending && (!donations || donations.length === 0) && (
        <p className="text-gray-600">
          No supporters yet. Be the first to donate!
        </p>
      )}
      <ul className="divide-y">
        {donations?.map((donation) => (
          <li
            key={donation.id}
            className="py-3 flex items-center justify-between"
          >
            <span className="text-gray-800">
              {donation.firstName} {donation.lastName}
            </span>
            <span className="text-gray-600">
              {donation.currencyCode} {donation.amount.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Supporters;
