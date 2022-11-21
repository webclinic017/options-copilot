export interface csvData {
  UnderlyingSymbol: string;
  Description: string;
  DateTime: string;
  Conid: number;
  Quantity: number;
  TradePrice: number;
  FifoPnlRealized: number;
}

export interface tradeData {
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

export interface ManualTrade {
  symbol: string;
  strike: string;
  contractId: string;
  openDate: Date;
  closeDate: Date;
  openTradePrice: number;
  closeTradePrice: number;
  quantity: number;
}
