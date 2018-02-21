import { InputTransformer } from "../adapter";
import { StringUtils } from "../utils";


export class UnaccentInputTransformer implements InputTransformer {

    transform(val: string): string {
        debugger;
        return StringUtils.unaccent(val);
    }
}
export class CapitalizeInputTransformer implements InputTransformer {
    constructor(private fully: boolean = true) { }
    transform(val: string): string {
        if (this.fully) {
            return StringUtils.capitalizeFully(val);
        } else {
            return StringUtils.capitalize(val);
        }
    }
}