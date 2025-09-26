// Stub for react-native-country-picker-modal on web
import React from "react";

export const CountryPicker = ({ onSelect, ...props }) => {
  return React.createElement(
    "select",
    {
      onChange: (e) => {
        if (onSelect) {
          onSelect({ cca2: e.target.value, name: e.target.value });
        }
      },
      style: { padding: "8px", border: "1px solid #ccc", borderRadius: "4px" },
    },
    [
      React.createElement(
        "option",
        { key: "US", value: "US" },
        "United States"
      ),
      React.createElement("option", { key: "CA", value: "CA" }, "Canada"),
      React.createElement(
        "option",
        { key: "GB", value: "GB" },
        "United Kingdom"
      ),
      // Add more countries as needed
    ]
  );
};

export default CountryPicker;
