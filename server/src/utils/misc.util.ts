export const mkzID = (len: number = 5): string => {
    const id = Date.now()
        .toString()
        .slice(12 - len, -1);

    return id.toString();
};

export const genSlug = (title: string): string => {
    title = title.replace(/[^0-9a-zA-Z ]/g, '').replace(/  +/g, ' '); //Replacing the special characters
    const arr = title.trim().toLowerCase().replace(/ +/g, '-');
    const str = arr.split(' ').join('-');
    return str;
};
