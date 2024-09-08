import PowerRadix from "power-radix";
import {base7} from "./radixSymbol";
import {RadixError} from "../processError/errorTypes";

// input: a number and a radix symbol.
// output: a length-2-array where every digit is base10 number. Besides, array[1] forever be positive.
// e.g. input: 13   (base12 symbol), output: [1, 1]
// e.g. input: 13   (base7 symbol),  output: [1, 6]
// e.g. input: 130  (base7 symbol),  output: [18, 4]
// e.g. input: -13  (base7 symbol),  output: [-2, 1]
// e.g. input: -1   (base7 symbol),  output: [-1, 6]
const get2DigitNumArrByNum = (givenNum: number, radixSymbol: string[]): [number, number] => {
    const positiveRadixCalc = (numStringLength_LengthMoreThan1: string): [number, number] => {
        const lastString = numStringLength_LengthMoreThan1.slice(numStringLength_LengthMoreThan1.length - 1, numStringLength_LengthMoreThan1.length)
        const prefixString = numStringLength_LengthMoreThan1.slice(0, numStringLength_LengthMoreThan1.length - 1)
        return [
            Number(new PowerRadix(prefixString, radixSymbol as any).toString(10)),
            Number(new PowerRadix(lastString, radixSymbol as any).toString(10)),
        ]
    }
    if (givenNum === 0) return [0, 0]
    if (givenNum > 0) {
        const base10String: string = new PowerRadix(givenNum, 10).toString(radixSymbol)
        if (base10String.length === 1) return [0, givenNum]
        if (base10String.length < 1) throw new RadixError("Wrong number given.")
        return positiveRadixCalc(base10String)
    }
    // the negative algorithm is, suppose negative radix [-m], use two digit [+m] array => [x,y] , then [ -(x+1), (radixDigitCount - y) ].
    const positiveNumString: string = new PowerRadix(givenNum * -1, 10).toString(radixSymbol)
    const positiveNumArr: [number, number] = positiveRadixCalc(positiveNumString)
    if (positiveNumArr[1] === 0) return [-1 * (positiveNumArr[0]), 0]
    return [-1 * (positiveNumArr[0] + 1), radixSymbol.length - positiveNumArr[1]]
}

// input: a length-2-number-array, a number(positive: add and negative: subtract), a radixSymbol.
// Each digit of the input length-2-number-array should be base10 number.
// output: a new length-2-number-array where every digit is base10 number.
// e.g. input: [0,5]   +8   (base7 symbol)     output:[1,6]
// e.g. input: [0,5]   +8   (base12 symbol)    output:[1,1]
const get2DigitNumArrByNumArrAddNum = (baseNumArr: [number, number],
                                       num: number, radixSymbol: string[]): [number, number] => {
    const radixLength = radixSymbol.length
    const base10Num = baseNumArr[0] * radixLength + baseNumArr[1] + num
    return get2DigitNumArrByNum(base10Num, radixSymbol)
}

// input: a base10 number, a number(positive: add and negative: subtract), a radixSymbol.
// output:a base10 number.
// e.g. input:  5    +8    (base7 symbol)     output: [1,6]
const get2DigitNumArrByNumAddNum = (baseNum: number, addNum: number, radixSymbol: string[]): [number, number] => {
    const targetNum = baseNum + addNum
    return get2DigitNumArrByNum(targetNum, radixSymbol)
}


// input: 2 length-2-number-arrays, radixSymbol.
// output: base10 number.
// e.g.  input: [1,0] [0,5] (base7 symbol)   output: -2
const getGapNumBetween2DigitNumArr = (arr1: [number, number], arr2: [number, number], radixSymbol: string[]): number => {
    const num1Base10 = radixSymbol.length * arr1[0] + arr1[1]
    const num2Base10 = radixSymbol.length * arr2[0] + arr2[1]
    return num2Base10 - num1Base10
}

// input: a length-2-number-array, radixSymbol.
// output: base10 number.
// e.g. input: [1,0] (base7 symbol)  output:7
const getNumBy2DigitNumArr = (arr: [number, number], radixSymbol: string[]) => {
    return arr[0] * radixSymbol.length + arr[1]
}
export default {
    get2DigitNumArrByNumArrAddNum, getNumBy2DigitNumArr,
    get2DigitNumArrByNum, get2DigitNumArrByNumAddNum, getGapNumBetween2DigitNumArr
}