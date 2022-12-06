"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTableFormateObj = exports.dataFormate = void 0;
const dataFormate = (dataFormate, dbData, isArray = true) => {
    let data = [];
    if (isArray) {
        dbData.map((d) => {
            let tmpData = {};
            dataFormate.map((data_f) => {
                if (d[data_f.db]) {
                    tmpData[data_f.mine] = d[data_f.db];
                }
            });
            data.push(tmpData);
        });
        return data;
    }
    else {
        let tmpData = {};
        for (let property in dbData) {
            dataFormate.map((data_f) => {
                if (data_f.db == property) {
                    tmpData[data_f.mine] = dbData[property];
                }
            });
        }
        return tmpData;
    }
};
exports.dataFormate = dataFormate;
exports.UserTableFormateObj = [
    {
        db: "_id",
        mine: "user_id"
    },
    {
        db: "name",
        mine: "user_name"
    },
    {
        db: "email",
        mine: "user_email"
    },
    {
        db: "username",
        mine: "user_username"
    },
];
