"use client";

import React, { useId, useState } from "react";
import { HiOutlineUpload } from "react-icons/hi";
import { FileInputProps } from "./type";

export const FileInput = ({
  name,
  label,
  labelClassName,
  className,
  placeholder,
  accept,
  error,
  onChange,
  labelRightHint,
  showRequiredAsterik = false,
  onSelectFile,
  onSelectMultipleFiles,
  multiple,
  ...props
}: FileInputProps) => {
  const [fileName, setFileName] = useState("");
  const inputId = useId();

  const handleChange = (e: any) => {
    setFileName(e?.target?.files?.[0]?.name);
    onChange && onChange(e);

    if (onSelectFile) {
      const file = e?.target?.files?.[0];
      if (!file) return;
      onSelectFile(file);
    }

    if (onSelectMultipleFiles) {
      const files = e?.target?.files;
      if (!files || files?.length === 0) return;

      console.log("files", files);

      onSelectMultipleFiles(files);
    }
  };

  return (
    <div className="py-3">
      <input
        type="file"
        id={inputId}
        className="hidden"
        name={name}
        accept={accept}
        onChange={handleChange}
        aria-describedby={labelRightHint ? `${inputId}-hint` : undefined}
        multiple={multiple}
        {...props}
      />
      {label && (
        <div className="flex justify-between">
          <label
            htmlFor={inputId}
            className={`flex justify-between text-xs font-medium ${labelClassName}`}
          >
            {label}{" "}
            {showRequiredAsterik && <span className="text-red-500">*</span>}
          </label>
          {labelRightHint && (
            <span className="text-xs text-primary ml-1" id={`${inputId}-hint`}>
              {labelRightHint}
            </span>
          )}
        </div>
      )}
      <button
        className={`relative mt-2 rounded-md flex border border-slate-300 cursor-pointer block w-full flex items-center focus:ring-2 focus:outline-none ${className}`}
        type="button"
        onClick={() => {
          document.getElementById(inputId)?.click();
        }}
      >
        <div className="flex items-center w-1/2 md:w-[80%] flex-1 pl-3 overflow-hidden">
          <span className="text-gray-500 text-xs sm:text-sm">
            {fileName ? fileName : placeholder ? placeholder : "Choose a file"}
          </span>
        </div>
        <div className="outline-0 bg-[#D4D4D8]/20 hover:bg-[#D4D4D8]/30 border-l border-slate-300 text-gray-600 h-12 text-xs  md:text-sm  p-2  flex items-center justify-center w-1/2 md:w-[20%] lg:max-w-[10vw] text-[#18181B]">
          <HiOutlineUpload className="mr-2" /> Upload
        </div>
      </button>
      {error && <p className="text-red-500 text-xs">{error?.message}</p>}
    </div>
  );
};
