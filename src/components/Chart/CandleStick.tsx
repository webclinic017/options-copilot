import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  SeriesMarker,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import { TradeData } from "@/interfaces/trade";
import { timeToLocal } from "@/utils/helper";
import TimeFrameModal from "../Modals/TimeFrameModal";

interface CandleStickProps {
  tradeData: TradeData[];
  candleData: {
    time: Time;
    close: number;
    high: number;
    low: number;
    open: number;
    volume: number;
  }[];
  handleTimeFrameChange: (number: number) => void;
}

const CandleStick = (props: CandleStickProps) => {
  const chartRef = useRef<HTMLDivElement>();
  const [legend, setLegend] = useState("");
  const [clickInsideToggle, setClickInsideToggle] = useState(false);
  const [message, setMessage] = useState<null | string>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const chart = createChart(chartRef.current, {
      width: 1000,
      height: 715,
      crosshair: {
        mode: 0,
      },

      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#485158",
      },
    });

    const volumeSeries = chart.addHistogramSeries({
      color: "#26a69a",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
      scaleMargins: {
        top: 0.9,
        bottom: 0,
      },
    });
    const volumeData = props.candleData.map((candleStick) => {
      return {
        time: candleStick.time,
        value: candleStick.volume,
        color: candleStick.close > candleStick.open ? "#26a69a" : "#ef5350",
      };
    });

    volumeSeries.setData(volumeData);

    const candleSeries = chart.addCandlestickSeries();
    candleSeries.setData(props.candleData);

    //Refactor this to change number 60 to Constant for clarification
    const markers: SeriesMarker<Time>[] = props.tradeData.map((trade) => ({
      time: (timeToLocal(new Date(trade.date_time).getTime() / 1000) -
        60) as UTCTimestamp,
      position: trade.quantity > 0 ? "belowBar" : "aboveBar",
      color: trade.quantity > 0 ? "#071de09a" : "#ef5350",
      shape: trade.quantity > 0 ? "arrowUp" : "arrowDown",
      text:
        trade.quantity > 0
          ? `B ${trade.quantity} @ ${trade.trade_price}`
          : `S ${trade.quantity} @ ${trade.trade_price}`,
    }));

    candleSeries.setMarkers(markers);

    chart.subscribeCrosshairMove((param) => {
      if (!param.point) {
        return;
      }
      const chartHoverData = props.candleData.find((x) => x.time == param.time);
      if (chartHoverData) {
        const hoverStr = `O: ${chartHoverData.open} H: ${chartHoverData.high} L: ${chartHoverData.low} C: ${chartHoverData.close}`;
        setLegend(hoverStr);
      }
    });

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [props]);

  const array = [1, 5, 15];

  const handleKeyPress = (e) => {
    if (!clickInsideToggle) setClickInsideToggle(true);
  };

  const handleModalToggle = () => {
    setClickInsideToggle(!clickInsideToggle);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      array.some((num) => num === parseInt(message))
        ? (props.handleTimeFrameChange(parseInt(message)), handleModalToggle())
        : setError(true);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    setError(false);
  };

  return (
    <div
      className="relative"
      ref={chartRef}
      onKeyDown={(e) => handleKeyPress(e)}
      tabIndex={1}
    >
      <div className="absolute top-4 ml-3 text-black z-10">{legend}</div>
      {clickInsideToggle && (
        <TimeFrameModal
          error={error}
          message={message}
          handleChange={handleChange}
          handleKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
};

export default CandleStick;
