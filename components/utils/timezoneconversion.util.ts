
import moment from "moment";
import momentTimezone from "moment-timezone";  


export const convertTimezonetoUTC = (utcDt: String, timeZone: string): string => {
    // const originalDate = moment(new Date(utcDt)).format('YYYY-MM-DDTHH:mm:ss');
    if (!timeZone) {
        timeZone = 'America/Toronto';
    }
    console.log(timeZone);
    const convertedTime = momentTimezone.tz(utcDt, timeZone).utc().toString();
    console.log(convertedTime);
    return convertedTime;
};


export const convertUTCToTimezone = (utcDt: Date, timeZone: string): any => {
    if (!timeZone) {
        timeZone = 'America/Toronto';
    }
    const toDt = momentTimezone.utc(utcDt).tz(timeZone);
    return toDt;
}