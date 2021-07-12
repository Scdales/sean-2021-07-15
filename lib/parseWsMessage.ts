import './types'
import '../components/types'
import { IWebsocketMessage } from './types'
import { IStateOrderBook } from '../components/types'
import { LIST_LENGTH, ORDERBOOK_SNAPSHOT } from "../constants";

function updateOrderBook(
    orderBookUpdateList: Array<Array<number>>,
    currentOrderBookList: Array<Array<number>>,
    sortFunction: (a: Array<number>, b: Array<number>) => number
) {
    orderBookUpdateList.forEach((order) => {
        const orderIndex = currentOrderBookList.findIndex(
            (orderLevel) => orderLevel[0] === order[0]
        )
        if (orderIndex > -1) {
            currentOrderBookList[orderIndex] = order
        } else {
            currentOrderBookList = [...currentOrderBookList, order]
        }
    })
    return currentOrderBookList
        .filter((bid) => bid[1] !== 0)
        .sort(sortFunction)
        .slice(0, LIST_LENGTH * 4)
}

export function parseWsMessage(
    orderBookUpdate: IWebsocketMessage,
    currentOrderBook: IStateOrderBook
) {
    if (!orderBookUpdate?.bids || !orderBookUpdate?.asks) {
        console.log('Websocket message:', orderBookUpdate)
        return currentOrderBook
    }
    if (orderBookUpdate?.feed === ORDERBOOK_SNAPSHOT) {
        return { bids: orderBookUpdate.bids, asks: orderBookUpdate.asks }
    }
    currentOrderBook.bids = updateOrderBook(
        orderBookUpdate.bids,
        currentOrderBook.bids,
        (a: Array<number>, b: Array<number>) => (a[0] < b[0] ? 1 : -1)
    )
    currentOrderBook.asks = updateOrderBook(
        orderBookUpdate.asks,
        currentOrderBook.asks,
        (a: Array<number>, b: Array<number>) => (a[0] > b[0] ? 1 : -1)
    )

    return currentOrderBook
}
