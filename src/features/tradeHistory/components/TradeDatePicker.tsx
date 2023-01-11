import React from "react";

import { DateRangePicker } from "rsuite";

const TradeDatePicker = (props) => (
  <DateRangePicker
    placeholder="Select Date Range"
    placement="bottomEnd"
    onOk={(value: [Date, Date]) => props.handleSelect(value)}
    onClean={() => props.handleSelect([])}
    showOneCalendar
    {...props}
  />
);

export default TradeDatePicker;
