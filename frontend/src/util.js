import numeral from "numeral";

export function formatFranks(n) {
    return numeral(n).format("0,0") + " Fr."
}