// utilities/react-native-country-picker-modal.web.js
import React from "react";

const COUNTRIES = [
  { cca2: "US", name: "United States", callingCode: ["1"] },
  { cca2: "CA", name: "Canada", callingCode: ["1"] },
  { cca2: "GB", name: "United Kingdom", callingCode: ["44"] },
  { cca2: "IN", name: "India", callingCode: ["91"] },
  { cca2: "AU", name: "Australia", callingCode: ["61"] },
  { cca2: "DE", name: "Germany", callingCode: ["49"] },
  { cca2: "FR", name: "France", callingCode: ["33"] },
  { cca2: "IT", name: "Italy", callingCode: ["39"] },
  { cca2: "ES", name: "Spain", callingCode: ["34"] },
  { cca2: "JP", name: "Japan", callingCode: ["81"] },
  { cca2: "CN", name: "China", callingCode: ["86"] },
  { cca2: "BR", name: "Brazil", callingCode: ["55"] },
  { cca2: "MX", name: "Mexico", callingCode: ["52"] },
  { cca2: "AE", name: "United Arab Emirates", callingCode: ["971"] },
  { cca2: "SA", name: "Saudi Arabia", callingCode: ["966"] },
  { cca2: "SG", name: "Singapore", callingCode: ["65"] },
  { cca2: "NL", name: "Netherlands", callingCode: ["31"] },
  { cca2: "SE", name: "Sweden", callingCode: ["46"] },
  { cca2: "NO", name: "Norway", callingCode: ["47"] },
  { cca2: "DK", name: "Denmark", callingCode: ["45"] },
  { cca2: "CH", name: "Switzerland", callingCode: ["41"] },
  { cca2: "NZ", name: "New Zealand", callingCode: ["64"] },
  { cca2: "ZA", name: "South Africa", callingCode: ["27"] },
  { cca2: "NG", name: "Nigeria", callingCode: ["234"] },
  { cca2: "PK", name: "Pakistan", callingCode: ["92"] },
  { cca2: "BD", name: "Bangladesh", callingCode: ["880"] },
  { cca2: "LK", name: "Sri Lanka", callingCode: ["94"] },
  { cca2: "TH", name: "Thailand", callingCode: ["66"] },
  { cca2: "KR", name: "South Korea", callingCode: ["82"] },
  { cca2: "PH", name: "Philippines", callingCode: ["63"] },
  { cca2: "MY", name: "Malaysia", callingCode: ["60"] },
];

export const CountryPicker = ({ onSelect, ...props }) => {
  return React.createElement(
    "select",
    {
      onChange: (e) => {
        const country = COUNTRIES.find(c => c.cca2 === e.target.value);
        if (onSelect && country) onSelect(country);
      },
      style: {
        // padding: "8px 10px",
        // border: "1px solid #ccc",
        // borderRadius: "6px",
        fontSize: "14px",
        cursor: "pointer",
        // backgroundColor: "#fff",
      },
    },
    COUNTRIES.map((country) =>
      React.createElement(
        "option",
        { key: country.cca2, value: country.cca2 },
        `${country.name} (+${country.callingCode[0]})`
      )
    )
  );
};

export default CountryPicker;
