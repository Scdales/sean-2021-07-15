export const styleNumber = (value: number, addDecimals: boolean = false) => {
    const stringedNumber = addDecimals ? value.toFixed(2).toString() : value.toString()
    if (stringedNumber.length <= 3) {
        return stringedNumber
    }
    const splitNumber = stringedNumber.split('')
    for (let i = splitNumber.length - 3; i > 0; i -= 3) {
        if (splitNumber[i] === '.') {
            continue
        }
        splitNumber.splice(i, 0, ',')
    }
    return splitNumber
}
