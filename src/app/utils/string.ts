import * as latinizeI from 'latinize'; 
const latinize = latinizeI;

export class StringUtils {

    static toString(str: any) {
        if (str === null || str === undefined) {
            return "";
        } else {
            return str + "";
        }
    }
    static isString(str: string): boolean {
        return typeof str == "string";
    }
    static getLength(str: string): number {
        if (typeof str == "string") {
            return str.length;
        } else {
            return 0;
        }
    }
    static capitalize(str: string): string {
        if (StringUtils.getLength(str) >= 2) {
            return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
        } else {
            return str;
        }
    }
    static capitalizeFully(str: string): string {
        if (StringUtils.getLength(str) > 0) {
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        } else {
            return str;
        }
    }
    static trim(str: string) {
        typeof str == "string" && (str = str.trim());
        return str;
    }
    static isNullOrEmpty(str: string): boolean {
        str = StringUtils.trim(str);
        return str == null || str == "";
    }
    static isNonEmptyString(str: string) {
        return (typeof str == "string" && !StringUtils.isNullOrEmpty(str));
    }
    static unaccent(str: string): string {
        debugger;
        return (StringUtils.isNonEmptyString(str)) ? latinize(str) : str;
    }
    static randomNum(len: number): string {
        var text = "";
        var charset = "0123456789";
        for (var i = 0; i < len; i++)
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        return text;
    }
}