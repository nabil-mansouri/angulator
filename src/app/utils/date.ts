
import * as momentImported from 'moment'; 
const moment = momentImported;
import { StringUtils } from "./string";
export class DateUtils {
    static ISO_LONG_FORMAT = "YYYY-MM-DDTHH:mm:ss.sssZ";
    static ISO_FORMAT = "YYYY-MM-DD";
    static ISO_FORMAT_TIME_SHORT = "HH:mm";
    static FRENCH_FORMAT = "DD-MM-YYYY";
    static DISPLAY_FORMAT = "DD/MM/YYYY";
    static DISPLAY_FORMAT_TIME = "HH:mm";
    static FORMATS = [
        DateUtils.ISO_LONG_FORMAT, DateUtils.ISO_FORMAT,
        DateUtils.FRENCH_FORMAT, DateUtils.DISPLAY_FORMAT,
        DateUtils.ISO_FORMAT_TIME_SHORT, DateUtils.DISPLAY_FORMAT_TIME];
    static isDate(obj: any): obj is Date {
        return obj instanceof Date && !isNaN(obj.valueOf());
    }

    static toDate(value: string): Date {
        let m = moment(value, DateUtils.FORMATS, true);
        if (m.isValid()) {
            return m.toDate();
        } else {
            return null;
        }
    }

    static isDateValid(str: string): boolean {
        let m = moment(str, DateUtils.FORMATS, true);
        if (StringUtils.isNullOrEmpty(str) || !m.isValid()) {
            return false;
        } else {
            return true;
        }
    }

}