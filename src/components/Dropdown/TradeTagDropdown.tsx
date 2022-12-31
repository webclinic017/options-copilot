import React, { useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { components } from "react-select";

import { useAddTradeTags } from "@/hooks/TradeTags/useAddTradeTags";

const TradeTagDropdown = ({
  options,
  dropdownType,
  selectedTags,
  handleDataChange,
  handleDeleteTagModalToggle,
}) => {
  const setUpTagColor = "#46cd7e";
  const mistakeTagColor = "#FF5630";
  const customTagColor = "#00B8D9";

  const { mutate, isLoading, isSuccess, data } = useAddTradeTags();

  useEffect(() => {
    if (data && isSuccess) {
      handleDataChange(
        [
          ...selectedTags,
          {
            value: data[0].name,
            label: data[0].name,
            tag_type: data[0].tag_type,
            tag_id: data[0].tag_id,
          },
        ],
        dropdownType
      );
    }
  }, [data]);

  const IconOption = (props) => {
    return (
      <div className="flex">
        <components.Option {...props}>{props.children}</components.Option>
        <span
          className="hover:bg-red-400 w-12 flex justify-center items-center active:bg-red-500 cursor-pointer"
          onClick={() => handleDeleteTagModalToggle(true, props.data.tag_id)}
        >
          <svg
            width="25"
            height="25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6 7a1 1 0 0 1 1 1v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 1 1 2 0v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a1 1 0 0 1 1-1z"
              fill="#e11616"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 8a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1zM14 8a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1zM4 5a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zM8 3a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z"
              fill="#e11616"
            />
          </svg>
        </span>
      </div>
    );
  };

  return (
    <div className="mt-2 z-20">
      <CreatableSelect
        instanceId={"Trade-Tag-Selector"}
        value={selectedTags}
        onChange={(val: { value: string; label: string }[]) => {
          handleDataChange(val, dropdownType);
        }}
        onCreateOption={async (value) => {
          const tagData = { name: value, tag_type: dropdownType };
          mutate(tagData);
        }}
        isMulti
        isLoading={isLoading}
        isDisabled={isLoading}
        options={options}
        components={{ Option: IconOption }}
        styles={{
          input: (baseStyles) => ({
            ...baseStyles,
            color: "white",
          }),
          multiValueRemove: (baseStyles) => ({
            ...baseStyles,
            color: "black",
          }),
          singleValue: (baseStyles, { data }: any) => ({
            ...baseStyles,
            backgroundColor:
              data.tag_type === "setup"
                ? setUpTagColor
                : data.tag_type === "mistake"
                ? mistakeTagColor
                : customTagColor,
          }),
          multiValue: (baseStyles, { data }: any) => ({
            ...baseStyles,
            backgroundColor:
              data.tag_type === "setup"
                ? setUpTagColor
                : data.tag_type === "mistake"
                ? mistakeTagColor
                : customTagColor,
          }),
          control: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: "transparent",
          }),
          valueContainer: (baseStyles) => ({
            ...baseStyles,
            maxHeight: "70px",
            overflow: "scroll",
          }),
          option: (baseStyles) => ({
            ...baseStyles,
            color: "black",
          }),
        }}
      />
    </div>
  );
};

export default TradeTagDropdown;
