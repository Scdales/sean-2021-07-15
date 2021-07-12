import '../types'
import { LIST_LENGTH } from '../../constants'
import TableRow from './TableRow'

interface IProps {
    orderList: Array<Array<number>>
    type: string
    isMobile: boolean
    rightToLeft?: boolean
}

export default function Table({ orderList, type, isMobile, rightToLeft = false }: IProps) {
    const grandTotalVol = orderList.reduce((acc: number, curr: Array<number>, idx: number) => {
        if (idx < LIST_LENGTH) {
            acc += curr[1]
        }
        return acc
    }, 0)

    const priceList =
        isMobile && type === 'ask' ? orderList.slice(0, LIST_LENGTH).reverse() : orderList

    return (
        <div className="flex-1 z-0">
            {!isMobile || (isMobile && type === 'ask') ? (
                <div className="py-1 grid grid-flow-col grid-cols-custom font-mono text-sm inline-block text-right font-extralight border-b border-gray-700 opacity-40">
                    <div>{rightToLeft ? 'TOTAL' : 'PRICE'}</div>
                    <div>SIZE</div>
                    <div>{rightToLeft ? 'PRICE' : 'TOTAL'}</div>
                </div>
            ) : null}
            {Array.from(Array(LIST_LENGTH)).map((_, index) => {
                if (!priceList?.[index]) {
                    return <div key={`${type}-price-${index}`} className="h-6" />
                }
                return (
                    <TableRow
                        key={`${type}-price-${index}`}
                        price={priceList[index][0]}
                        vol={priceList[index][1]}
                        totalVol={priceList.reduce((acc, curr, idx) => {
                            if ((!isMobile || type === 'bid') && idx <= index) {
                                acc += curr[1]
                            } else if (isMobile && type === 'ask' && idx >= index) {
                                acc += curr[1]
                            }
                            return acc
                        }, 0)}
                        type={type}
                        grandTotalVol={grandTotalVol}
                        isMobile={isMobile}
                        rightToLeft={rightToLeft}
                    />
                )
            })}
        </div>
    )
}
