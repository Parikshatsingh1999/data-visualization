import { useContext } from "react";
import { DataContext, IDataContext } from "../contexts/DataContexts";

type TableRowProps = {
  methodName: string;
  keyToCheckValue: string;
};

export const TableRow = ({ methodName, keyToCheckValue }: TableRowProps) => {
  const { ClassesKeyNames, calculationFun } = useContext(
    DataContext
  ) as IDataContext;
  return (
    <>
      <tr>
        <th>
          <p>{keyToCheckValue}</p>
          {methodName}
        </th>
        {ClassesKeyNames.map((name) => (
          <td key={`row-${name}`}>
            {calculationFun(methodName.toLowerCase(), keyToCheckValue, name)}
          </td>
        ))}
      </tr>
    </>
  );
};
