export class BooleanUtils {
    static isTrue(str: any): boolean {
        if (typeof str == "boolean") {
            return str;
        } else if (typeof str == "string") {
            return str == "true";
        } else {
            return !!str;
        }
    }
}