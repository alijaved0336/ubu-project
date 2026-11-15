// export const formattedDate = (val) => {
//     const date = new Date(val);
//     const options = { day: 'numeric', month: 'long', year: 'numeric' };
//     return date.toLocaleDateString('en-GB', options);
// };

export const formattedDate = (val) => {
    const date = new Date(val);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};
