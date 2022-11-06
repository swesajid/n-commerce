interface iFormatOptions {
    oldDate?: Date;
    timezone?: string;
    dateTime?: boolean;
    timeOnly?: boolean;
}

export const formatDateToLocal = (formatOptions: iFormatOptions): string => {
    const oldDate = formatOptions.oldDate ? formatOptions.oldDate : new Date();
    const { dateTime, timezone, timeOnly } = formatOptions;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const dayIndex = oldDate.getDay();
    const date = oldDate.getDate();
    const month = oldDate.getMonth();
    const year = oldDate.getFullYear();
    const hours = oldDate.getHours();
    const minutes = oldDate.getMinutes();

    let result = '';

    if (dateTime) {
        result += `${days[dayIndex]}, ${months[month]} ${date}, ${year} - ${Math.abs(hours - 12)}:${
            minutes > 9 ? minutes : '0' + minutes
        } ${hours > 12 ? 'PM' : 'AM'}`;
    } else {
        result += `${days[dayIndex]}, ${months[month]} ${date}, ${year}`;
    }

    if (typeof timezone !== 'undefined') {
        result += ' ' + timezone.toUpperCase();
    }

    if (timeOnly) {
        result = `${Math.abs(hours - 12)}:${minutes > 9 ? minutes : '0' + minutes} ${hours > 12 ? 'PM' : 'AM'}`;
    }

    return result;
};

export const formatDateForInput = (date: string, dateOnly = false): string => {
    const targetDate = new Date(date);

    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() > 9 ? targetDate.getMonth() + 1 : '0' + (targetDate.getMonth() + 1);
    const day = targetDate.getDate();
    const hours = targetDate.getHours() > 9 ? targetDate.getHours() : '0' + targetDate.getHours();
    const minutes = targetDate.getMinutes() > 9 ? targetDate.getMinutes() : '0' + targetDate.getMinutes();
    const seconds = targetDate.getSeconds();

    return dateOnly ? `${year}-${month}-${day}` : `${year}-${month}-${day}T${hours}:${minutes}`;
};
