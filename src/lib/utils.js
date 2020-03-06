

export default {
    compare(condition, a, b) {
        switch(condition) {
            case 'gte':
                return a >= b
            case 'lte':
                return a <= b
            case 'gt':
                return a > b
            case 'lt':
                return a < b
            case 'is':
                return a === b
        }
    },
    gte(a, b) {
        return a >= b
    },
    lte(a, b) {
        return a <= b
    },
    gt(a, b) {
        return a > b
    },
    lt(a, b) {
        return a < b
    },
}