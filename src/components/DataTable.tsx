import { useContext } from "react";
import { DataContext, IDataContext } from "../contexts/DataContexts";
import { TableRow } from "./TableRow";

type DataTableProps = {
  keyToCalculate?: string;
};

export const DataTable = ({
  keyToCalculate = "Flavanoids",
}: DataTableProps) => {
  const { name, ClassesKeyNames } = useContext(DataContext) as IDataContext;

  const typeOfResults = ["Mean", "Median", "Mode"];

  return (
    <div className="maintable-box">
      {name}
      <p>
        for <strong>{keyToCalculate} </strong>
      </p>

      <table>
        <thead>
          <tr>
            <th> Measure </th>
            {ClassesKeyNames.map((name: string) => (
              <th key={name}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {typeOfResults.map((name: string) => (
            <TableRow
              key={name}
              methodName={name}
              keyToCheckValue={keyToCalculate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
