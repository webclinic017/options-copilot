import React from "react";

import { DateRangePicker } from "rsuite";

interface Props {
  selectDate: (value: any) => void;
}

export const TradeDatePicker = ({ selectDate }: Props) => (
  <DateRangePicker
    placeholder="Select Date Range"
    placement="bottomEnd"
    onOk={(value: [Date, Date]) => selectDate(value)}
    onClean={() => selectDate([])}
    showOneCalendar
  />
);
