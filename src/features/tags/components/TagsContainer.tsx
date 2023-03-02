import { useState } from "react";

import { useGetTagsByType } from "@/features/tradeStats";
import { sortTagsByType } from "@/utils/sort";

export const TagsContainer = () => {
  const [tagType, setTagType] = useState<"setup" | "mistake" | "custom">(
    "setup"
  );

  const { data } = useGetTagsByType(tagType);

  const tags = sortTagsByType(data);

  const stepColor = [
    "step-primary",
    "step-secondary",
    "step-accent",
    "step-info",
    "step-success",
    "step-warning",
    "step-error",
    "step-primary",
    "step-secondary",
    "step-accent",
  ];

  return (
    <div className="flex-1 mt-5 bg-base-100 p-4 rounded-lg mr-12 h-[25rem] overflow-auto">
      <div className="flex flex-col space-y-3 relative">
        <div className="tabs self-center justify-between">
          {["setup", "mistake", "custom"].map(
            (tab: "setup" | "mistake" | "custom") => (
              <p
                key={tab}
                className={`tab tab-bordered uppercase ${
                  tagType === tab ? "tab-active" : ""
                }`}
                onClick={() => setTagType(tab)}
              >
                {tab}
              </p>
            )
          )}
        </div>

        <ul className="steps steps-vertical">
          {tags?.map((tag, index) => (
            <li
              key={tag.tag_id}
              className={`step ${stepColor[index]} text-white cursor-pointer select-none`}
            >
              {tag.name}
              <span className="absolute right-0 ">{tag.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
