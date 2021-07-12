import { styleNumber } from '../../lib/styleNumber'
import 'react-dropdown/style.css'

interface IProps {
    price: number
    vol: number
    totalVol: number
    type: string
    grandTotalVol: number
    isMobile: boolean
    rightToLeft: boolean
}

export default function TableRow({
    price,
    vol,
    totalVol,
    type,
    grandTotalVol,
    isMobile,
    rightToLeft,
}: IProps) {
    const histogramScaleValue = (totalVol / grandTotalVol).toFixed(4)
    const totalElement = <div>{styleNumber(totalVol)}</div>
    const priceElement = (
        <div className={`text-${type === 'bid' ? 'green' : 'red'}-500`}>
            {styleNumber(price, true)}
        </div>
    )

    const classNameGenerator = () => {
        const classNames = [
            `bg-${type === 'bid' ? 'green' : 'red'}-400`,
            'opacity-30',
            `w-${isMobile ? 'full' : '2/4'}`,
            'absolute h-6 -z-1',
            `origin-${type === 'bid' ? (isMobile ? 'left' : 'right') : 'left'}`,
            'transition-transform duration-100',
        ]
        return classNames.join(' ')
    }

    return (
        <>
            <div
                className={classNameGenerator()}
                style={{ transform: `scaleX(${histogramScaleValue})` }}
            />
            <div className="font-mono text-xs h-6 grid grid-flow-col grid-cols-custom content-center text-right">
                {rightToLeft ? totalElement : priceElement}
                <div>{styleNumber(vol)}</div>
                {rightToLeft ? priceElement : totalElement}
                <div style={{ width: '5%' }} />
            </div>
        </>
    )
}
