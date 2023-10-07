export const formatNumber = (passednum) => {
    const number = Math.abs(passednum);
    if (passednum < 0) {
        if (number >= 1000000) {
            return -(number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return -(number / 1000).toFixed(1) + 'K';
        } else {
            return -number.toString();
        }
    } else {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        } else {
            return number.toString();
        }
    }
};

// get number of days in month
//use current month and year as initial inputs
export const getDaysInMonth = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Adding 1 because months are zero-based

    return new Date(year, month, 0).getDate();
};

export const calculatePercentage = (numerator, denominator) => {
    if (denominator === 0) {
        return 0;
    }
    const percentage = (numerator / denominator) * 100;
    return percentage.toFixed(2); // Limiting the result to 2 decimal places
};

export const DateFormatter = (soldat) => {
    var year = soldat.slice(0, 4);
    var month = soldat.slice(5, 7);
    var day = soldat.slice(8, 10);
    const date = day + '-' + month + '-' + year;
    return date;
};

export const Achievement = (revenue, target) => {
    let status;
    if (revenue >= target) {
        status = 'achieved';
        return status;
    } else {
        status = 'in-progress';
        return status;
    }
};

export const formatDate = (createdAt) => {
    const date = new Date(createdAt);

    // Get the month name
    const monthNames = [
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
        'December'
    ];
    const month = monthNames[date.getMonth()];

    // Get the day and pad it with leading zeros if necessary
    const day = String(date.getDate()).padStart(2, '0');

    // Get the year
    const year = date.getFullYear();

    // Format the date as DDMMYYYY
    const formattedDate = `${day}-${month.slice(0, 3)}-${year}`;

    return {
        monthName: month.slice(0, 3),
        formattedDate: formattedDate
    };
};
