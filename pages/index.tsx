import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { IStateOrderBook } from '../components/types'
import { isEqual, cloneDeep } from 'lodash'
import {
    BTC_ID,
    BTC_PRICE_LEVELS,
    DEFAULT_ORDERBOOK,
    ETH_ID,
    ETH_PRICE_LEVELS,
    UI_REFRESH_RATE,
    WEBSOCKET_CLOSEDSTATE,
    WEBSOCKET_OPENSTATE,
    WEBSOCKET_URL,
} from '../constants'
import { parseWsMessage } from '../lib/parseWsMessage'
import Table from '../components/Table/Table'
import HeaderBar from '../components/HeaderBar'
import Button from '../components/Button'
import { Option } from 'react-dropdown'
import { groupOrders } from '../lib/groupOrders'
let refreshUiTimeout

export default function Home() {
    const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)
    const [orderBook, setOrderbook] = useState(DEFAULT_ORDERBOOK as IStateOrderBook)
    const [productId, setProductId] = useState(BTC_ID)
    const [priceStepLevel, setPriceStepLevel] = useState<Option>(BTC_PRICE_LEVELS[0])
    const [isFeedKilled, setIsFeedKilled] = useState(false)
    const priceStepLevelRef = useRef<number>(0.5)
    const orderBookBuffer = useRef({ asks: [], bids: [] } as IStateOrderBook)
    const websocket = useRef<WebSocket | null>(null)

    const connectToWebsocket = () => {
        if (websocket.current?.readyState === WEBSOCKET_OPENSTATE) {
            console.log('Websocket Switching To', productId)
            websocket.current.send(
                JSON.stringify({
                    event: 'unsubscribe',
                    feed: 'book_ui_1',
                    product_ids: [productId === BTC_ID ? ETH_ID : BTC_ID],
                })
            )
            websocket.current.send(
                JSON.stringify({
                    event: 'subscribe',
                    feed: 'book_ui_1',
                    product_ids: [productId],
                })
            )
            setPriceStepLevel(productId === BTC_ID ? BTC_PRICE_LEVELS[0] : ETH_PRICE_LEVELS[0])
            setOrderbook(DEFAULT_ORDERBOOK)
            orderBookBuffer.current = { asks: [], bids: [] }
        } else {
            websocket.current = new WebSocket(WEBSOCKET_URL)
            if (isFeedKilled) {
                setIsFeedKilled(false)
            }
        }

        const timeoutCheck = () => {
            setOrderbook((prev: IStateOrderBook) => {
                if (!isEqual(orderBookBuffer.current, prev)) {
                    if (priceStepLevelRef.current !== 0.5 && priceStepLevelRef.current !== 0.005) {
                        return {
                            bids: groupOrders(
                                cloneDeep(orderBookBuffer.current.bids),
                                priceStepLevelRef.current
                            ),
                            asks: groupOrders(
                                cloneDeep(orderBookBuffer.current.asks),
                                priceStepLevelRef.current
                            ),
                        }
                    }
                    return { ...orderBookBuffer.current }
                }
                return prev
            })
            refreshUiTimeout = setTimeout(() => timeoutCheck(), UI_REFRESH_RATE)
        }

        websocket.current.onopen = () => {
            console.log('Websocket Connection Opened')
            websocket.current?.send(
                JSON.stringify({
                    event: 'subscribe',
                    feed: 'book_ui_1',
                    product_ids: [productId],
                })
            )
            refreshUiTimeout = setTimeout(() => timeoutCheck(), UI_REFRESH_RATE)
        }

        websocket.current.onmessage = (event: MessageEvent) => {
            const parsedMessage = JSON.parse(event.data)
            orderBookBuffer.current = parseWsMessage(parsedMessage, orderBookBuffer.current)
        }

        websocket.current.onerror = (err: Event) => {
            console.error('Websocket Error', err)
            if (websocket.current?.readyState === WEBSOCKET_OPENSTATE) {
                setIsFeedKilled(true)
                websocket.current.close()
            } else if (websocket.current?.readyState === WEBSOCKET_CLOSEDSTATE) {
                setIsFeedKilled(false)
                connectToWebsocket()
            }
        }
    }

    const throwWebsocketError = () => {
        const errorEvent = new CustomEvent('error')
        websocket.current?.dispatchEvent(errorEvent)
    }

    useEffect(() => {
        priceStepLevelRef.current = Number(priceStepLevel.value)
    }, [priceStepLevel])

    useEffect(() => {
        setIsMobile(window.innerWidth < 576)
        connectToWebsocket()
    }, [productId])

    useEffect(() => {
        return () => {
            websocket.current?.close()
        }
    }, [])

    const spreadString = () => {
        const spread = orderBook.asks[0]?.[0] - orderBook.bids[0]?.[0]
        const spreadPercentage =
            (orderBook.asks[0]?.[0] - orderBook.bids[0]?.[0]) / orderBook.asks[0]?.[0]
        return isNaN(spread) || isNaN(spreadPercentage)
            ? ''
            : `Spread ${spread.toFixed(1)} (${spreadPercentage.toFixed(4)}%)`
    }

    if (isMobile !== undefined) {
        return (
            <>
                <Head>
                    <title>Orderbook</title>
                </Head>
                <div className="flex flex-auto flex-col bg-indigoBlue text-blue-50">
                    <HeaderBar
                        spreadString={spreadString()}
                        dropdownValue={priceStepLevel}
                        dropdownValues={
                            productId === 'PI_XBTUSD' ? BTC_PRICE_LEVELS : ETH_PRICE_LEVELS
                        }
                        setDropdownValue={setPriceStepLevel}
                        isMobile={isMobile}
                    />
                    <div className={`flex flex-1 justify-center flex-${isMobile ? 'col' : 'row'}`}>
                        {isMobile ? (
                            <Table orderList={orderBook.asks} type="ask" isMobile={isMobile} />
                        ) : null}
                        {isMobile ? (
                            <div className="flex justify-center py-2 opacity-40">
                                {spreadString()}
                            </div>
                        ) : null}
                        <Table
                            orderList={orderBook.bids}
                            type="bid"
                            isMobile={isMobile}
                            rightToLeft={!isMobile}
                        />
                        {!isMobile ? (
                            <Table orderList={orderBook.asks} type="ask" isMobile={isMobile} />
                        ) : null}
                    </div>
                    <div className="flex flex-1 justify-center">
                        <Button
                            label="Toggle Feed"
                            color="purple"
                            onClick={() => {
                                setProductId((prev) => (prev === BTC_ID ? ETH_ID : BTC_ID))
                            }}
                        />
                        <Button
                            label={`${isFeedKilled ? 'Restart' : 'Kill'} Feed`}
                            color="red"
                            onClick={throwWebsocketError}
                        />
                    </div>
                </div>
            </>
        )
    }
    return null
}
