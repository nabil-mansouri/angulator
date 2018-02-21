

export function stringArray(str: string | string[]): string[] {
    return (typeof str == "string") ? [str] : str;
}