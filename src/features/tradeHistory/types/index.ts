export interface CsvData {
  Symbol: string;
  Description: string;
  DateTime: string;
  Conid: number;
  Quantity: number;
  TradePrice: number;
  FifoPnlRealized: number;
}

export interface TradeData {
  contract_id: number;
  date_time: string;
  description: string;
  id: number;
  pnl_realized: number;
  quantity: number;
  symbol: string;
  trade_price: number;
  user_id: string;
}
