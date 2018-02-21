import { getMetadata, NbMetadata } from "./metadata";
import { stringArray } from "./utils";
import * as validator from "./validators";
import * as transform from "./impl/transfomers";
import * as listeners from "./impl/listeners";
export { DateLimit } from "./validators";

//NbMetadata.DEFAULT_STATES_LISTNERS.push(new listeners.NBModelStateListenerAttrName);
export function RequiredIf(deps: string | Array<string>, isBoolean: boolean = true) {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.addDeps(stringArray(deps));
        meta.validators.push(new validator.RequiredIfBuilder(stringArray(deps), isBoolean));
    }
}
export function EnabledIf(deps: string | Array<string>, isBoolean: boolean = true) {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.addDeps(stringArray(deps));
        meta.validators.push(new validator.EnabledIfBuilder(stringArray(deps), isBoolean));
    }
}

export function DisabledIf(deps: string | Array<string>, all: boolean = false, isBoolean: boolean = true) {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.addDeps(stringArray(deps));
        meta.validators.push(new validator.DisabledIfBuilder(stringArray(deps), isBoolean));
    }
}
export function MaxLengthIf(deps: string | Array<string>, max: number, separator: string) {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.addDeps(stringArray(deps));
        meta.validators.push(new validator.MaxLengthIfBuilder(stringArray(deps), max, separator));
    }
}
export function Unaccent() {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.inputTransformers.push(new transform.UnaccentInputTransformer);
    }
}

export function Capitalize(fully: boolean = true) {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.inputTransformers.push(new transform.CapitalizeInputTransformer(fully));
    }
}
export function ReadOnly() {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(new validator.ReadOnlyBuilder());
    }
}
export function Required() {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(validator.REQUIRED);
    }
}
export function RequiredTrue() {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(validator.REQUIRED_TRUE);
    }
}

export function MinLength(min: number) {
    return function (target: any, propertyKey: string) {
        getMetadata(target, propertyKey).validators.push(new validator.MinLengthBuilder(min));
        //TODO change attribute element
    }
}
export function MaxLength(max: number) {
    return function (target: any, propertyKey: string) {
        getMetadata(target, propertyKey).validators.push(new validator.MaxLengthBuilder(max));
        //TODO change attribute element
    }
}
export function Length(eq: number) {
    return function (target: any, propertyKey: string) {
        MinLength(eq)(target, propertyKey);
        MaxLength(eq)(target, propertyKey);
    }
}
export function IsEqual(value: number) {
    return function (target: any, propertyKey: string) {
        Min(value)(target, propertyKey);
        Max(value)(target, propertyKey);
    }
}
export function Min(min: number) {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(validator.MIN(min));
    }
}
export function Max(max: number) {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(validator.MAX(max));
    }
}
export function MinDate(min: string | validator.DateLimit) {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(new validator.MinDateBuilder(min));
    }
}
export function MaxDate(max: string | validator.DateLimit) {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(new validator.MaxDateBuilder(max));
    }
}
export function MinArray(min: number) {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(validator.MIN_ARRAY(min));
    }
}
export function MaxArray(max: number) {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(validator.MAX_ARRAY(max));
    }
}

export function Range(min: number, max: number) {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(validator.RANGE(min, max));
    }
}


export function Pattern(pattern: string | RegExp) {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(validator.PATTERN(pattern));
    }
}


export function IsIP() {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(validator.IP);
    }
}

export function Digits() {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(validator.DIGITS);
    }
}

export function DateIso() {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(validator.DATEISO);
    }
}

export function IsEmail() {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(validator.EMAIL);
    }
}
export function IsDate() {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(validator.ISDATE);
    }
}
export function IsUrl() {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(validator.URL);
    }
}
export function IsNumber() {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(validator.NUMBER);
    }
}
export function DateGt(deps: string | Array<string>, orEqual: boolean = true) {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.addDeps(stringArray(deps));
        meta.validators.push(new validator.DateGtBuilder(stringArray(deps), orEqual));
    }
}
export function DateLt(deps: string | Array<string>, orEqual: boolean = true) {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.addDeps(stringArray(deps));
        meta.validators.push(new validator.DateLtBuilder(stringArray(deps), orEqual));
    }
}
export function Phone() {
    return function (target: any, propertyKey: string) {
        let meta = getMetadata(target, propertyKey);
        meta.validators.push(validator.PHONE);
        //TODO mask
    }
}