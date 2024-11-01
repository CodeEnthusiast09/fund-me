import clsx from "clsx";
import { Option } from "./Select.type";
import SelectSearch from "react-dropdown-select";
import { useEffect, useMemo } from "react";

export const SearchableSelect = ({
  error,
  ariaLabel,
  label,
  labelClassName,
  className,
  placeholder,
  leftIcon,
  defaultValue,
  defaultValues,
  onChange,
  options,
  showRequiredAsterik = false,
  multi = false,
  radius = "rounded",
  ...rest
}: any) => {
  const defaultOptions = useMemo(() => {
    if (multi && defaultValues) {
      return options?.filter(
        (option: Option) => defaultValues?.includes(option.value) || null
      );
    } else if (defaultValue) {
      return (
        options?.filter((option: Option) => option.value === defaultValue) ||
        null
      );
    } else {
      return null;
    }
  }, [multi, options, defaultValues, defaultValue]);

  // call onChange with defaultOptions on component mount
  useEffect(() => {
    if (defaultOptions && defaultOptions.length > 0) {
      onChange?.(defaultOptions);
    }
  }, [defaultOptions, onChange]);

  return (
    <div className="py-3">
      {label && (
        <label
          htmlFor={label || ariaLabel}
          className={`block text-xs font-medium  ${labelClassName}`}
        >
          {label}{" "}
          {showRequiredAsterik && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className={clsx("relative mt-1", radius ? radius : "rounded-md")}>
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">{leftIcon}</span>
          </div>
        )}

        <SelectSearch
          multi={multi}
          options={
            options?.map((option: Option) => ({
              label: option?.label,
              value: option?.value,
            })) || []
          }
          name={rest?.name || "select"}
          // defaultOptions ||
          values={defaultOptions || []}
          onChange={(values: Option[]) => onChange?.(values)}
          className={clsx(
            "mt-2 outline-0 placeholder-[#515151] text-gray-600 block w-full h-12  text-sm  p-2 border-none border-red-300 focus:outline-2  px-3 rounded-full",
            className
            // radius
          )}
        />
      </div>
      <p className="text-red-500 text-xs">{error?.message}</p>
    </div>
  );
};
