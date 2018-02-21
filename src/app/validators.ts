import { AsyncValidatorFn, Validator, ValidatorFn, FormControl, Validators } from "@angular/forms";
import { StringUtils, BooleanUtils, DateUtils } from "./utils";
import { NbModel } from "./nbmodel";
import { CustomValidators } from 'ng2-validation';
import * as momentImported from 'moment'; 
const moment = momentImported;

import { state } from "./state_keys";

function isPresent(x) {
    return !!x;
}
function isBlank(x) {
    return !x;
}
export interface SyncValidator {
    build(model: NbModel): ValidatorFn | Validator;
}
export interface ASyncValidator {
    build(model: NbModel): AsyncValidatorFn;
}
export class DefaultBuilder implements SyncValidator {
    constructor(private val: ValidatorFn) { }
    build(model: NbModel): ValidatorFn {
        return this.val;
    }
}
export class DateLimit {
    constructor(public val: string) {

    }
    static Now = new DateLimit("NOW");
    static Today = new DateLimit("TODAY");
    static Midnight = new DateLimit("MIDNIGHT");
    static years(diff: number): string {
        return moment().add(diff, "years").toISOString();
    }
    static convertToIso(limit: string | DateLimit) {
        if (limit instanceof DateLimit) {
            return limit.dateLimitToISO();
        } else {
            return limit;
        }
    }
    static convertToUnix(limit: number | DateLimit) {
        if (limit instanceof DateLimit) {
            return limit.dateLimitToUnix();
        } else {
            return limit;
        }
    }
    dateLimitToUnix(): number {
        switch (this.val) {
            case DateLimit.Now.val:
                return moment().unix();
            case DateLimit.Today.val:
                return moment().startOf('day').unix();
            case DateLimit.Midnight.val:
                return moment().endOf('day').unix();
        }
    }
    dateLimitToISO(): string {
        switch (this.val) {
            case DateLimit.Now.val:
                return moment().format(DateUtils.ISO_FORMAT);
            case DateLimit.Today.val:
                return moment().startOf('day').format(DateUtils.ISO_FORMAT);
            case DateLimit.Midnight.val:
                return moment().endOf('day').format(DateUtils.ISO_FORMAT);
        }
    }
}
class NBValidators {
    static disabled(): ValidatorFn {
        return (control: FormControl): { [key: string]: any } => {
            control.disable();
            return null;
        };
    }
    static phone(): ValidatorFn {
        let REGEXP = /^(\([0][1-9]\)\s)(([0-9]{2}\-){3})([0-9]{2})$/;
        let v = Validators.pattern(REGEXP);
        return (c: FormControl) => {
            return v(c);
        };
    }
    static ip(): ValidatorFn {
        let pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        let valid = Validators.pattern(pattern);
        return (c: FormControl) => {
            return valid(c);
        };
    }
    static arrayMax(max: number): ValidatorFn {
        return (control: FormControl): { [key: string]: any } => {
            let val: any[] = control.value;
            //
            if (val instanceof Array) {
                if (val.length > max) {
                    return { "arrayMin": true };
                }
            }
            return null;
        };
    }
    static arrayMin(min: number): ValidatorFn {
        return (control: FormControl): { [key: string]: any } => {
            let val: any[] = control.value;
            //
            if (val instanceof Array) {
                if (val.length < min) {
                    return { "arrayMin": true };
                }
            }
            return null;
        };
    }
    static minDate(limit: string | DateLimit): ValidatorFn {
        let _limit = DateLimit.convertToIso(limit);
        let dateLimit = moment(_limit).toDate();
        return (c: FormControl) => {
            if (_limit) {
                if (isPresent(Validators.required(c)))
                    return null;
                var d = DateUtils.toDate(c.value);
                if (!DateUtils.isDate(d))
                    return { minDate: true };
                return d >= dateLimit ? null : { minDate: true };
            } else {
                return null;
            }
        };
    }
    static maxDate(limit: string | DateLimit): ValidatorFn {
        let _limit = DateLimit.convertToIso(limit);
        let dateLimit = moment(_limit).toDate();
        return (c: FormControl) => {
            if (_limit) {
                if (isPresent(Validators.required(c)))
                    return null;
                var d = DateUtils.toDate(c.value);
                if (!DateUtils.isDate(d))
                    return { maxDate: true };
                return d <= dateLimit ? null : { maxDate: true };
            } else {
                return null;
            }
        };
    }
}
export const REQUIRED = new DefaultBuilder(Validators.required);
export const REQUIRED_TRUE = new DefaultBuilder(Validators.requiredTrue);
export const EMAIL = new DefaultBuilder(CustomValidators.email);
export const IP = new DefaultBuilder(NBValidators.ip());
export const PHONE = new DefaultBuilder(NBValidators.phone());
export const URL = new DefaultBuilder(CustomValidators.url);
export const NUMBER = new DefaultBuilder(CustomValidators.number);
export const DIGITS = new DefaultBuilder(CustomValidators.digits);
export const DATEISO = new DefaultBuilder(CustomValidators.dateISO);
export const ISDATE = new DefaultBuilder(CustomValidators.date);
export const MIN = (min: number) => new DefaultBuilder(CustomValidators.min(min));
export const MAX = (max: number) => new DefaultBuilder(CustomValidators.max(max));
export const MIN_ARRAY = (min: number) => new DefaultBuilder(NBValidators.arrayMin(min));
export const MAX_ARRAY = (max: number) => new DefaultBuilder(NBValidators.arrayMax(max));
export const MIN_DATE = (min: string | DateLimit) => new DefaultBuilder(NBValidators.minDate(min));
export const MAX_DATE = (max: string | DateLimit) => new DefaultBuilder(NBValidators.maxDate(max));
export const PATTERN = (pattern: string | RegExp) => new DefaultBuilder(Validators.pattern(pattern));
export const RANGE = (min: number, max: number) => new DefaultBuilder(CustomValidators.range([min, max]));

export class MinLengthBuilder implements SyncValidator {
    constructor(private min: number) { }
    build(model: NbModel): ValidatorFn {
        return (c: FormControl) => {
            model.state.set(state.MIN_LENGTH, this.min);
            let str = StringUtils.toString(c.value);
            let length = StringUtils.getLength(str);
            if (length < this.min) {
                return { nbMinLength: true };
            } else {
                return null;
            }
        };
    }
}

export class MaxLengthBuilder implements SyncValidator {
    constructor(private max: number) { }
    build(model: NbModel): ValidatorFn {
        return (c: FormControl) => {
            model.state.set(state.MAX_LENGTH, this.max);
            let str = StringUtils.toString(c.value);
            let length = StringUtils.getLength(str);
            if (length > this.max) {
                return { nbMaxLength: true };
            } else {
                return null;
            }
        };
    }
}
export class MinDateBuilder {
    constructor(private limit: string | DateLimit) { }
    build(model: NbModel): ValidatorFn {
        let _limit = DateLimit.convertToIso(this.limit);
        let dateLimit = moment(_limit).toDate();
        return (c: FormControl) => {
            if (_limit) {
                model.state.set(state.MIN_DATE, _limit);
                if (isPresent(Validators.required(c)))
                    return null;
                var d = DateUtils.toDate(c.value);
                if (!DateUtils.isDate(d))
                    return { minDate: true };
                return d >= dateLimit ? null : { minDate: true };
            } else {
                model.state.set(state.MIN_DATE, null);
                return null;
            }
        };
    }
}

export class MaxDateBuilder {
    constructor(private limit: string | DateLimit) { }
    build(model: NbModel): ValidatorFn {
        let _limit = DateLimit.convertToIso(this.limit);
        let dateLimit = moment(_limit).toDate();
        return (c: FormControl) => {
            debugger;
            if (_limit) {
                model.state.set(state.MAX_DATE, _limit);
                if (isPresent(Validators.required(c)))
                    return null;
                var d = DateUtils.toDate(c.value);
                if (!DateUtils.isDate(d))
                    return { maxDate: true };
                return d <= dateLimit ? null : { maxDate: true };
            } else {
                model.state.set(state.MAX_DATE, null);
                return null;
            }
        };
    }
}

export class RequiredIfBuilder implements SyncValidator {
    constructor(private deps: string[], private isBool: boolean) { }
    isRequired(model: NbModel): boolean {
        let values = model.findValuesInTree(this.deps);
        if (this.isBool) {
            values = values.map(m => BooleanUtils.isTrue(m));
        }
        return values.reduce((b1, b2) => b1 && b2, true);
    }
    build(model: NbModel): ValidatorFn {
        return (c: FormControl) => {
            if (this.isRequired(model)) {
                return Validators.required(c);
            } else {
                return null;
            }
        };
    }
}
export class MaxLengthIfBuilder implements SyncValidator {
    constructor(private deps: string[], private max: number, private separator: string) { }

    isLessOrEqual(model: NbModel): boolean {
        let values = model.findValuesInTree(this.deps);
        values.push(model.value);
        let concatAll = values.map((s1) => StringUtils.toString(s1))
            .filter(val => StringUtils.isNonEmptyString(val))
            .join(this.separator);
        let diff = this.max - StringUtils.getLength(concatAll);
        let valueLen = StringUtils.getLength(model.value)
        if (diff > 0) {
            model.state.set(state.MAX_LENGTH, valueLen + diff);
        } else {
            model.state.set(state.MAX_LENGTH, valueLen - diff);
        }
        return 0 <= diff;
    }
    build(model: NbModel): ValidatorFn {
        return (c: FormControl) => {
            if (this.isLessOrEqual(model)) {
                return null;
            } else {
                return { maxLengthIf: true };
            }
        };
    }
}

export class ReadOnlyBuilder implements SyncValidator {
    constructor() { }


    build(model: NbModel): ValidatorFn {
        return (c: FormControl) => {
            model.state.set(state.READONLY, true)
            return null;
        };
    }
}
export class EnabledIfBuilder implements SyncValidator {
    constructor(private deps: string[], private isBool: boolean) { }
    isEnable(model: NbModel): boolean {
        let values = model.findValuesInTree(this.deps);
        if (this.isBool) {
            values = values.map(m => BooleanUtils.isTrue(m));
        }
        return values.reduce((b1, b2) => b1 && b2, true);
    }
    build(model: NbModel): ValidatorFn {
        return (c: FormControl) => {
            model.isDisabled = !this.isEnable(model);
            return null;
        };
    }
}
export class DisabledIfBuilder extends EnabledIfBuilder {
    build(model: NbModel): ValidatorFn {
        return (c: FormControl) => {
            model.isDisabled = this.isEnable(model);
            return null;
        };
    }
}
export class DateGtBuilder implements SyncValidator {
    constructor(protected deps: string[], protected orEqual: boolean) { }
    compare(model: NbModel): { compare: number, fail: boolean, present: boolean } {
        let values = model.findValuesInTree(this.deps);
        let currentVal = model.value;
        let otherVal = values[0];
        if (DateUtils.isDate(otherVal)
            && DateUtils.isDate(currentVal)) {
            let valDate: Date = currentVal;
            let otherDate: Date = otherVal;
            debugger;
            if (valDate == otherVal) {
                return { compare: 0, fail: false, present: true };
            } else if (valDate > otherDate) {
                return { compare: 1, fail: false, present: true };
            } else {
                return { compare: -1, fail: false, present: true };
            }
        } else if (!otherVal || !currentVal) {
            return { compare: null, fail: false, present: false };
        } else {
            return { compare: null, fail: true, present: true };
        }
    }
    build(model: NbModel): ValidatorFn {
        return (c: FormControl) => {
            let comp = this.compare(model);
            if (comp.present) {
                if (comp.fail) {
                    return { dateGt: true }
                } else if (this.orEqual) {
                    return comp.compare >= 0 ? null : { dateGt: true };
                } else {
                    return comp.compare > 0 ? null : { dateGt: true };
                }
            }
            return null;
        };
    }
}
export class DateLtBuilder extends DateGtBuilder {
    build(model: NbModel): ValidatorFn {
        return (c: FormControl) => {
            let comp = this.compare(model);
            if (comp.present) {
                if (comp.fail) {
                    return { dateLt: true }
                } else if (this.orEqual) {
                    return comp.compare <= 0 ? null : { dateLt: true };
                } else {
                    return comp.compare < 0 ? null : { dateLt: true };
                }
            }
            return null;
        };
    }
}




