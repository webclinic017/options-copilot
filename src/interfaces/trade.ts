export interface csvData {
  UnderlyingSymbol: string;
  Description: string;
  DateTime: string;
  Conid: number;
  Quantity: number;
  TradeMoney: number;
  FifoPnlRealized: number;
}

export interface tradeData {
  contract_id: number;
  date_time: String;
  description: string;
  id: number;
  pnl_realized: number;
  quantity: number;
  symbol: String;
  trade_price: number;
  user_id: String;
}
