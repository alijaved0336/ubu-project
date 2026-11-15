import moment from 'moment';

export function FormatTimeStamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export const formatDateStamp = (timestamp, format = 'MMM D, YYYY h:mm a') => {
    return moment(timestamp).format(format);
  };
  
  export const formatDateStampWithoutTime = (timestamp, format = 'MMM D') => {
    return moment(timestamp).format(format);
  };

export const formatMonthYear= (monthYear) => {
    const [year, month] = monthYear.split("-");
    const date = new Date(year, month - 1); 
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' }); 
}

