import { PageTitleProps } from "./type";

export const PageTitle = ({
  title,
  description,
  level = 1,
}: PageTitleProps) => {
  return (
    <div>
      {title && level == 1 && (
        <h1 className="text-gray-900 forest:text-black font-semibold text-xl xl:text-2xl capitalize">
          {title}
        </h1>
      )}

      {title && level == 2 && (
        <h2 className="text-primary-500 font-semibold uppercase text-xl">
          {title}
        </h2>
      )}

      <div className="text-sm text-gray-500 mt-2">{description}</div>
    </div>
  );
};
