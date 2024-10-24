import { IndeterminateCheckbox } from "components/input/indeterminate-checkbox";
import { TableCell } from "interfaces";

export const TableRowSelectionColumn = {
  id: "select",
  header: ({ table }: any) => (
    <IndeterminateCheckbox
      {...{
        checked: table.getIsAllRowsSelected(),
        indeterminate: table.getIsSomeRowsSelected(),
        onChange: table.getToggleAllRowsSelectedHandler(),
      }}
    />
  ),
  cell: ({ row }: TableCell) => (
    <div className="px-1">
      <IndeterminateCheckbox
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    </div>
  ),
};
