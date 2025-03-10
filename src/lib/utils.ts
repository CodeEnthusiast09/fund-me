import { Pagination } from "interfaces";
import {
  retrieveFromLocalStorage,
  deleteFromLocalStorage,
} from "./localStorage";

export const isTokenExpired = () => {
  const expiration = retrieveFromLocalStorage("token_expiration");
  if (!expiration) return true;
  return Date.now() > parseInt(expiration, 10);
};

export const convertCamelKeysToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj?.map((item) => convertCamelKeysToSnakeCase(item));
  } else if (typeof obj === "object" && obj !== null) {
    return Object?.keys(obj)?.reduce((acc, key) => {
      const snakeKey = key?.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
      // @ts-ignore
      acc[snakeKey] = convertCamelKeysToSnakeCase(obj[key]);
      return acc;
    }, {});
  } else {
    return obj;
  }
};

export const convertSnakeCaseKeysToCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertSnakeCaseKeysToCamelCase(item));
  } else if (typeof obj === "object" && obj !== null) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_./g, (match) =>
        match.charAt(1).toUpperCase()
      );

      // @ts-ignore
      acc[camelKey] = convertSnakeCaseKeysToCamelCase(obj[key]);
      return acc;
    }, {});
  } else {
    return obj;
  }
};

export const formatDate = (date: string | undefined) => {
  if (!date || date.toString() === "") return "N/A";
  const inputDate =
    date?.split("-")[0]?.length === 4 ? new Date(date) : parseInputDate(date);

  return inputDate.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getTimeFromDate = (dateString: string): string => {
  const inputDate = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
  };
  return inputDate.toLocaleTimeString(undefined, options);
};
export const formatDateWithoutWeekday = (date: string) => {
  if (!date || date.toString() === "") return "N/A";
  const inputDate =
    date?.split("-")[0]?.length === 4 ? new Date(date) : parseInputDate(date);

  return inputDate.toLocaleDateString("en-us", {
    // weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getMonthAndYearFromDate = (date: string) => {
  if (!date || date.toString() === "") return "N/A";
  const inputDate =
    date?.split("-")[0]?.length === 4 ? new Date(date) : parseInputDate(date);

  return inputDate.toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
  });
};

export const getTimeAgo = (dateString: string): string => {
  const inputDate = new Date(dateString);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - inputDate.getTime();
  const secondsAgo = Math.floor(timeDifference / 1000);

  if (secondsAgo < 60) {
    return secondsAgo <= 1 ? "just now" : `${secondsAgo} seconds ago`;
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
  } else if (secondsAgo < 3600) {
    const hoursAgo = Math.floor(secondsAgo / 3600);
    return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
  } else {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
    };
    return inputDate.toLocaleTimeString(undefined, options);
  }
};

export const getDaysAgo = (dateString: string): string => {
  const inputDate = new Date(dateString);
  const currentDate = new Date();
  const differenceInMs = currentDate.getTime() - inputDate.getTime();
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  if (differenceInDays === 0) {
    return "today";
  } else if (differenceInDays === 1) {
    return "yesterday";
  } else {
    return `${differenceInDays} days ago`;
  }
};

const parseInputDate = (input: string): Date => {
  const [datePart] = input.split(" ");
  const [day, month, year] = datePart?.split("-") || [];

  // Ensure the date string is in the "yyyy-mm-dd" format
  const formattedDateString = `${year}-${month}-${day}`;

  return new Date(formattedDateString);
};

export const getBgStatusColor = (status: string) => {
  if (!status) return "bg-gray-500";

  switch (status?.toLocaleLowerCase()) {
    case "active":
      return "bg-green-500";
    case "approved":
      return "bg-green-500";
    case "pending":
      return "bg-primary-500";
    case "inactive":
      return "bg-red-500";
    case "declined":
      return "bg-red-500";
    case "suspended":
      return "bg-[#F87171]";
    default:
      return "bg-gray-500";
  }
};

export const addCommaToNumber = (
  val: number | string,
  includeTrailingZeros: boolean = false
) => {
  if (val === "" || val === ".") return val;

  let [wholePart, decimalPart] = String(val)?.replaceAll(",", "").split(".");

  wholePart = new Intl.NumberFormat().format(Number(wholePart));

  if (decimalPart !== undefined) {
    if (includeTrailingZeros) {
      decimalPart = decimalPart.padEnd(2, "0");
    } else {
      // decimalPart = decimalPart.replace(/0+$/, "");
      // if (decimalPart === "") {
      if (val?.toString().includes(".") && !decimalPart) {
        return `${wholePart}.`;
      } else if (val?.toString().includes(".") && decimalPart !== "00") {
        return `${wholePart}.${decimalPart}`;
      } else {
        return wholePart;
      }
      // }
    }
    return `${wholePart}.${decimalPart}`;
  } else {
    return wholePart;
  }
};

export const formatNumberWithSuffix = (amount: number | string): string => {
  let num = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(num)) {
    throw new Error("Invalid amount");
  }

  // Define thresholds for million, billion, and trillion
  const thousand = 1_000;
  const million = 1_000_000;
  const billion = 1_000_000_000;
  const trillion = 1_000_000_000_000;

  // Handle cases based on the value of the number
  if (num < thousand) {
    return num.toString();
  } else if (num < million) {
    return formatLargeNumber(num, thousand, "K");
  } else if (num < billion) {
    return formatLargeNumber(num, million, "M");
  } else if (num < trillion) {
    return formatLargeNumber(num, billion, "B");
  } else {
    return formatLargeNumber(num, trillion, "T");
  }
};

export const formatLargeNumber = (
  value: number,
  divisor: number,
  suffix: string
): string => {
  const dividedValue = value / divisor;
  return dividedValue % 1 === 0
    ? `${dividedValue}${suffix}`
    : `${dividedValue.toFixed(1)}${suffix}`;
};
// Function to scroll to the bottom
export const scrollToBottom = (ref: any) => {
  if (ref.current) {
    ref.current.scrollTop = ref.current.scrollHeight;
  }
};

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    "NEXT_PUBLIC_API_BASE_URL",
    "NEXT_PUBLIC_API_KEY",
    "NEXT_PUBLIC_TECHNICAL_SUPPORT_EMAIL",
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. This site will not work without them. \n${missingEnvironmentVariables.join(
        "\n"
      )}\n`
    );
  }
};

export const clearAuthenticationCredentials = () => {
  deleteFromLocalStorage("token");
  deleteFromLocalStorage("user-id");
  deleteFromLocalStorage("email");
};

export const extractPaginationFromGetResponse = (
  resolvedData: Pagination
): Pagination | null => {
  if (!resolvedData?.currentPage) {
    return null;
  }

  const pagination: Pagination = {
    currentPage: resolvedData?.currentPage,
    hasMorePages: resolvedData?.hasMorePages,
    lastPage: resolvedData?.lastPage,
    perPage: resolvedData?.perPage,
    total: resolvedData?.total,
  };

  return pagination;
};

export const formatNumberWithConditionalDecimal = (
  value: number | string
): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    return "";
  }

  // Check if the number is effectively a whole number
  if (Math.floor(num) === num) {
    return num.toString();
  }

  // Format the number to two decimal places
  return num.toFixed(2);
};

type BoolToStringObject = { [key: string]: any };

export const convertBooleanStringsFromObject = (
  obj: BoolToStringObject
): any => {
  const result: BoolToStringObject = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (typeof value === "string") {
        if (value === "true") {
          result[key] = true;
        } else if (value === "false") {
          result[key] = false;
        } else {
          result[key] = value;
        }
      } else if (typeof value === "object" && value !== null) {
        result[key] = convertBooleanStringsFromObject(value);
      } else {
        result[key] = value;
      }
    }
  }

  return result;
};

export const truncateString = (input: string, maxLength = 100): string => {
  if (!input?.trim()) return "";
  if (input.length > maxLength) {
    return input.substring(0, maxLength) + "...";
  }

  return input;
};

export const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

export const extractHoursAndMinutes = (time: string | undefined): string => {
  if (!time) return "";
  return time.slice(0, 5);
};
