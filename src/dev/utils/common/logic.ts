export const or = (...args: any[]) => {
    return args.some(x => x)
}

export const and = (...args: any[]) => {
    return args.every(x => x)
}