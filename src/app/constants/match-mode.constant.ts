export const MatchModeOptions = {
    text: ['contains', 'equals', 'startsWith'],
    date: ['dateIs', 'dateBefore', 'dateAfter'],
    month: ['monthIs', 'monthBefore', 'monthAfter'],
    year: ['yearIs', 'yearBefore', 'yearAfter'],
    rangeDate: ['rangeBetweenDate', 'rangeEqualsDate'],
    rangeMonth: ['rangeBetweenMonth', 'rangeEqualsMonth'],
    rangeYear: ['rangeBetweenYear', 'rangeEqualsYear'],
    multipleDate: ['multipleDate'],
    multipleMonth: ['multipleMonth'],
    multipleYear: ['multipleYear']
};