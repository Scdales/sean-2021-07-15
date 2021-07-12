export interface IWebsocketMessage {
    event?: string;
    version?: number;
    feed?: string;
    product_ids?: Array<string>;
    product_id?: string;
    bids?: Array<Array<number>>;
    asks?: Array<Array<number>>;
}

