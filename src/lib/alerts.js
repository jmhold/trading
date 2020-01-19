export const alerts = [
    {
        // default
        // alert: /\$[A-Z]{2,4}(.* ([B,b]uying here|[A,a]dding here|[O,o]pening here))/g
        alert: /^\$[A-Z]{2,4}/g // (.* ([B,b](ought|uying)|[A,a]dd(ed|ing)|[O,o]pen(ed|ing)))
    },
    {
        id: 1702156,
        alert: /^\$[A-Z]{2,4}( ([B,b]uying|[A,a]dding|[O,o]pening)|(.* ([B,b]uying here|[A,a]dding here|[O,o]pening here)))/g
    }
]