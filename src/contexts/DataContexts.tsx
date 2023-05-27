import { ReactNode, createContext } from "react";
import JSONData from "../assets/Wine-Data.json";

type DataContextsProps = {
  children: ReactNode;
};

export interface ISingleClassData {
  Alcohol: number;
  "Malic Acid": number;
  Ash: number;
  "Alcalinity of ash": number;
  Magnesium: number;
  "Total phenols": number;
  Flavanoids: number;
  "Nonflavanoid phenols": number;
  Proanthocyanins: number;
  "Color intensity": number;
  Hue: number;
  "OD280/OD315 of diluted wines": number;
  Unknown: number;
  [key: string]: number;
}

interface IClassContents {
  [key: string]: ISingleClassData[];
}

export type IDataContext = {
  name: string;
  ClassesData: IClassContents;
  ClassesKeyNames: string[];
  calculationFun: (
    method: string,
    dataProperty: string,
    className: string
  ) => number | string;
};

interface IUtilityFunctions {
  mode: (key: string, className: string) => number | string;
  median: (key: string, className: string) => number | string;
  mean: (key: string, className: string) => number | string;
  [key: string]: (key: string, className: string) => number | string;
}

const ClassesData: IClassContents = {};
const ClassesKeyNames: string[] = [];

// base function to seperate out class wise data;
(function () {
  const data: ISingleClassData[] = JSONData as any;
  data.forEach((item) => {
    let key = `Class-${item.Alcohol}`;
    if (ClassesData[key]) {
      ClassesData[key].push(item);
    } else {
      ClassesData[key] = [item];
      ClassesKeyNames.push(key);
    }
  });
})();

// interface and object to cache results , to reduce similar executions
interface ICacheResult {
  [key: string]: any;
}

const resultCaching: ICacheResult = {};

// A function to attach any new property based on any method.
const additionalProperties: any = {
  Gamma: (item: ISingleClassData) => {
    return (item.Ash * item.Hue) / item.Magnesium;
  },
};

export const DataContext = createContext<IDataContext | null>(null);

// main context creater. Using faccade pattern, to cap all base/ logical code.
export const DataProviderContexts = ({ children }: DataContextsProps) => {
  const getClassWiseDataForProperty = (property: string, className: string) => {
    const data = ClassesData[className]?.map((item) => {
      if (item[property]) {
        return Number(item[property]) || 0;
      } else {
        return additionalProperties[property]?.(item) || 0;
      }
    });
    resultCaching[className] = { [property]: data };
    return data;
  };

  // A single utility function object, can be seperated out too.
  const UtilityFunctions: IUtilityFunctions = {
    // to find mode
    mode: (key: string, className: string) => {
      let data;
      if (resultCaching[className]?.[key]) {
        data = resultCaching[className]?.[key];
      } else {
        data = getClassWiseDataForProperty(key, className);
      }

      let numMapping: any = {};
      let greatestFreq: any = 0;
      let mode: number = 0;
      data.forEach((element: number) => {
        numMapping[element] = (numMapping[element] || 0) + 1;

        if (greatestFreq < numMapping[element]) {
          greatestFreq = numMapping[element];
          mode = element;
        }
      });
      const result = mode;
      return result.toFixed(3);
    },

    // to find median
    median: (key: string, className: string) => {
      let data;
      if (resultCaching[className]?.[key]) {
        data = resultCaching[className]?.[key];
      } else {
        data = getClassWiseDataForProperty(key, className);
      }
      data = data.sort();
      const mid = Math.floor(data.length / 2);
      const result =
        data.length % 2 !== 0 ? data[mid] : (data[mid - 1] + data[mid]) / 2;
      return result.toFixed(3);
    },

    // to find mean
    mean: (key: string, className: string) => {
      let data;
      if (resultCaching[className]?.[key]) {
        data = resultCaching[className]?.[key];
      } else {
        data = getClassWiseDataForProperty(key, className);
      }
      const result =
        data.reduce((a: number, b: number) => a + b, 0) / data.length;
      return result.toFixed(3);
    },
  };

  const calculationFun = (
    method: string,
    dataProperty: string,
    className: string
  ) => {
    const result = UtilityFunctions[method](dataProperty, className);
    return result;
  };

  return (
    <DataContext.Provider
      value={{
        name: "Data Table",
        ClassesData,
        ClassesKeyNames,
        calculationFun,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
