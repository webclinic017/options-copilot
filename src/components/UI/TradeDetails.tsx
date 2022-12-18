import React from "react";
import useTradeForm from "@/hooks/TradeDetails/useTradeForm";
import { TradeDetails } from "@/interfaces/trade";
import TradeTagDropdown from "../Form/Dropdown/TradeTagDropdown";
import { Popover, Whisper, Button } from "rsuite";

const TradeDetails = ({
  tradeData,
  stockData,
  allTags,
  contractTags,
}: TradeDetails) => {
  const options = allTags.data.map((tag) => {
    return {
      value: tag.name,
      label: tag.name,
      tag_type: tag.tag_type,
      tag_id: tag.tag_id,
    };
  });

  const savedTags = allTags.data
    .filter(({ tag_id: tagId }) =>
      contractTags.data.some(
        ({ tag_id: contractTagId }) => tagId === contractTagId
      )
    )
    .map(({ name, tag_type, tag_id }) => {
      return {
        value: name,
        label: name,
        tag_type: tag_type,
        tag_id: tag_id,
      };
    });

  const selectedDate = new Date(tradeData.trades[0].date_time);

  const contractId = tradeData.trades[0].contract_id;
  const userId = tradeData.trades[0].user_id;

  const formattedDate = `${selectedDate.getFullYear()}-${
    selectedDate.getMonth() + 1
  }-${selectedDate.getDate()}`;

  const profitOrLoss =
    tradeData.trades.reduce((acc, obj) => {
      return acc + obj.pnl_realized;
    }, 0) ?? 0;

  const totalOptionsTraded =
    tradeData.trades.reduce((acc, obj) => {
      return acc + Math.abs(obj.quantity);
    }, 0) ?? 0;

  const { formData, handleDataChange, handleDataSubmit } =
    useTradeForm(savedTags);
  const { setup, mistake, custom, loading, toggle } = formData;

  return (
    <div className="bg-gray-800/80 flex-auto min-w-[22rem] space-y-3 px-5">
      <div className="text-xs flex justify-between mt-5">
        Symbol
        <span>Last</span>
      </div>
      <div className="text-base flex justify-between">
        {tradeData.trades[0].symbol}
        {stockData && <span>{stockData.c}</span>}
      </div>

      <div className="text-base flex justify-between">
        <span>Date</span>
        {selectedDate.toDateString()}
      </div>

      <div className="text-base flex justify-between">
        <div>Contract Desc</div>
        <span>{tradeData.trades[0].description}</span>
      </div>

      <div className="text-base flex justify-between">
        NET P&L
        <span
          className={`${profitOrLoss > 0 ? "text-green-500" : "text-red-500"}`}
        >
          ${profitOrLoss.toFixed(2)}
        </span>
      </div>
      <div className="text-base flex justify-between  cursor-pointer">
        <Whisper
          followCursor
          speaker={
            <Popover className="bg-black">
              <ul>
                {tradeData.trades.map((data) => (
                  <div key={data.id}>{`${data.quantity > 0 ? "Buy" : "Sell"} ${
                    data.quantity
                  } @ ${data.date_time.slice(11)}`}</div>
                ))}
              </ul>
            </Popover>
          }
        >
          <p className="underline">Options Traded</p>
        </Whisper>
        <span> {totalOptionsTraded} </span>
      </div>

      <div className="text-base flex justify-between">Proft Target</div>

      <div className="text-base flex justify-between">Stop Loss</div>

      <div className="text-base flex justify-between">Trade Risk</div>
      <div className="text-base flex justify-between">Planned R:R Multiple</div>
      <div className="text-base flex justify-between">
        Realized R:R Multiple
      </div>
      <div className="">
        <div className="text-base flex-column">
          <p>Setups</p>
          <TradeTagDropdown
            options={options.filter((tag) => tag.tag_type === "setup")}
            dropdownType="setup"
            selectedTags={setup}
            handleDataChange={handleDataChange}
          />
        </div>
        <div className="text-base flex-column">
          <p>Mistakes</p>
          <TradeTagDropdown
            options={options.filter((tag) => tag.tag_type === "mistake")}
            dropdownType="mistake"
            selectedTags={mistake}
            handleDataChange={handleDataChange}
          />
        </div>
        <div className="text-base flex-column pb-4">
          <p>Custom</p>
          <TradeTagDropdown
            options={options.filter((tag) => tag.tag_type === "custom")}
            dropdownType="custom"
            selectedTags={custom}
            handleDataChange={handleDataChange}
          />
        </div>
      </div>

      <Button
        disabled={toggle}
        appearance="primary"
        loading={loading}
        as={"div"}
        block
        onClick={() =>
          handleDataSubmit(contractId, formattedDate, userId, savedTags)
        }
      >
        Save
      </Button>
    </div>
  );
};

export default TradeDetails;
