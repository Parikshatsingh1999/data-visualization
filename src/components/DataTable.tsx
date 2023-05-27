import { useContext, useState } from "react";
import { DataContext, IDataContext } from "../contexts/DataContexts";
import { TableRow } from "./TableRow";

type DataTableProps = {
  keyToCalculate?: string;
  showChange?: boolean;
};

export const DataTable = ({
  keyToCalculate = "Flavanoids",
  showChange = false,
}: DataTableProps) => {
  const { name, ClassesKeyNames, AvailableProperties } = useContext(
    DataContext
  ) as IDataContext;

  const [propertyName, setPropertyName] = useState(keyToCalculate);
  const typeOfResults = ["Mean", "Median", "Mode"];

  const changeProperty = (e: any) => {
    setPropertyName(e.target.value);
  };

  return (
    <div className="maintable-box">
      {name}
      <p>
        for <strong>{propertyName} </strong>
      </p>

      {!!showChange && AvailableProperties.length && (
        <div className="change-box">
          <p> Choose your desired Property </p>
          <select onChange={changeProperty} value={propertyName}>
            {AvailableProperties.map((item, index) => (
              <option key={`property${index}`} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      )}

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
              keyToCheckValue={propertyName}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
