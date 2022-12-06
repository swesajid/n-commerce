export const dataFormate = (dataFormate :any, dbData:any, isArray = true) => {
    let data:any = []

    if (isArray) {
        dbData.map((d:any) => {
            let tmpData:any = {}
            dataFormate.map((data_f:any) => {
                if (d[data_f.db]) {
                    tmpData[data_f.mine] = d[data_f.db]
                }
            })
            data.push(tmpData)
        })
        return data
    } else {
        let tmpData:any = {}
        for (let property in dbData) {
            dataFormate.map((data_f:any) => {
                if (data_f.db == property) {
                    tmpData[data_f.mine] = dbData[property]
                }
            })
        }

        return tmpData
    }


};

export const UserTableFormateObj = [
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
]
