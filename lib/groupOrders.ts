export function groupOrders(orders: Array<Array<number>>, priceStep: number) {
    return orders.reduce((acc: Array<Array<number>>, curr: Array<number>, idx: number) => {
        if (idx === 0) {
            acc = [curr]
        } else if (Math.abs(acc[acc.length - 1][0] - curr[0]) <= priceStep) {
            acc[acc.length - 1][1] = acc[acc.length - 1][1] + curr[1]
        } else {
            acc = [...acc, curr]
        }
        return acc
    }, [])
}
