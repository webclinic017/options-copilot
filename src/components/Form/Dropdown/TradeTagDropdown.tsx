import React, { useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { useAddTradeTags } from "../../../hooks/TradeTags/useAddTradeTags";

const TradeTagDropdown = ({
  options,
  dropdownType,
  selectedTags,
  handleDataChange,
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
