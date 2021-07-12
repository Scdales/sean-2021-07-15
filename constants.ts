export const UI_REFRESH_RATE = 30 // in ms
export const DEFAULT_ORDERBOOK = { asks: [], bids: [] };
export const LIST_LENGTH = 16
export const BTC_PRICE_LEVELS = [
    { value: '0.5', label: 'Group 0.5' },
    { value: '1', label: 'Group 1' },
    { value: '2.5', label: 'Group 2.5' },
]
export const ETH_PRICE_LEVELS = [
    { value: '0.05', label: 'Group 0.05' },
    { value: '0.1', label: 'Group 0.1' },
    { value: '0.25', label: 'Group 0.25' },
]
export const BTC_ID = 'PI_XBTUSD'
export const ETH_ID = 'PI_ETHUSD'
export const WEBSOCKET_URL = 'wss://www.cryptofacilities.com/ws/v1'
export const ORDERBOOK_SNAPSHOT = "book_ui_1_snapshot"

export const WEBSOCKET_OPENSTATE = 1
export const WEBSOCKET_CLOSEDSTATE = 3