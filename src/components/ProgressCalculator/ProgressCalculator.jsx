export function calculateProgress(startDate, endDate) {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (currentDate < start) return 0;
    if (currentDate > end) return 100;

    const totalDuration = end - start;
    const elapsedTime = currentDate - start;

    return Math.ceil((elapsedTime / totalDuration) * 100);
}

export function timeToEnd(endDate) {
    const currentDate = new Date();
    const endDateObject = new Date(endDate);
    const timeDifference = endDateObject - currentDate;
    const daysToEnd = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
    return daysToEnd;
}