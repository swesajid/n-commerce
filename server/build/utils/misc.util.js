"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genSlug = exports.mkzID = void 0;
const mkzID = (len = 5) => {
    const id = Date.now()
        .toString()
        .slice(12 - len, -1);
    return id.toString();
};
exports.mkzID = mkzID;
const genSlug = (title) => {
    title = title.replace(/[^0-9a-zA-Z ]/g, '').replace(/  +/g, ' '); //Replacing the special characters
    const arr = title.trim().toLowerCase().replace(/ +/g, '-');
    const str = arr.split(' ').join('-');
    return str;
};
exports.genSlug = genSlug;
