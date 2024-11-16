"use client";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { CheckableListProps, Option } from "./type";

export const CheckableList = ({
  label,
  showRequiredAsterik,
  labelClassName,
  options,
  selectedItems,
  setSelectedItems,
  error,
}: CheckableListProps) => {
  return (
    <div className="py-3">
      {label && (
        <label
          className={`block text-xs font-medium text-black ${labelClassName}`}
        >
          {label}{" "}
          {showRequiredAsterik && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="border mt-2 rounded-md divide-y lg:max-h-[20vh] overflow-y-auto">
        {options?.map((option: Option, index: number) => {
          return (
            <label
              className={`flex justify-between items-center p-3 cursor-pointer hover:bg-slate-100`}
              key={index}
            >
              <input
                type="checkbox"
                className="hidden"
                value={option?.value}
                checked={selectedItems
                  ?.map(String)
                  ?.includes(option?.value.toString())}
                onChange={(e) => {
                  const value = e.target.value;

                  if (e.target.checked) {
                    setSelectedItems?.((prev) => [...prev, value]);
                  } else {
                    setSelectedItems?.((prev) =>
                      prev.filter(
                        (item) => item.toString() !== value.toString()
                      )
                    );
                  }
                }}
              />
              <div className="flex gap-4 items-center">
                <div className="flex flex-col">
                  <span className="text-sm">{option?.label}</span>
                </div>
              </div>
              <div>
                {selectedItems
                  ?.map(String)
                  ?.includes(option?.value.toString()) && (
                  <AiOutlineCheckCircle className="text-primary text-2xl" />
                )}
              </div>
            </label>
          );
        })}
      </div>
      {error && (
        <div className="text-red-500 text-xs mt-2">{error?.message}</div>
      )}
    </div>
  );
};
