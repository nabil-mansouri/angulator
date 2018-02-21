import {
    ControlValueAccessor
} from '@angular/forms';
import { NbMetadata } from "./metadata";
export interface Formatter {
    transform(val: any): any;
}
export interface Parser {
    transform(val: any): any;
}
export interface InputTransformer {
    transform(val: any): any;
}
export class NBModelAdapter implements ControlValueAccessor {
    formatters: Formatter[] = [];
    parsers: Parser[] = [];
    transformers: InputTransformer[] = [];
    constructor(protected inner: ControlValueAccessor, private meta: NbMetadata) {
        this.setFormatters(meta.formatters);
        this.setParsers(meta.parsers);
        this.setTransformers(meta.inputTransformers);
    }
    writeValue(obj: any): void {
        //FORMAT VALUE
        if (this.formatters.length) {
            this.formatters.forEach(tr => {
                obj = tr.transform(obj);
            });
        }
        this.inner.writeValue(obj);
    }
    registerOnChange(fn: any): void {
        this.inner.registerOnChange((val) => {
            //TRANSFORM INPUT
            if (this.transformers.length) {
                this.transformers.forEach(tr => {
                    val = tr.transform(val);
                });
                this.inner.writeValue(val);
            }
            //PARSE VALUE
            if (this.parsers.length) {
                this.parsers.forEach(tr => {
                    val = tr.transform(val);
                });
            }
            fn(val);
        });
    }
    registerOnTouched(fn: any): void {
        this.inner.registerOnTouched(fn);
    }
    setDisabledState?(isDisabled: boolean): void {
        this.inner.setDisabledState && this.inner.setDisabledState(isDisabled);
    }
    setParsers(tr: Parser[]) {
        if (tr instanceof Array) {
            tr.forEach(t => this.parsers.push(t));
        }
    }
    setFormatters(tr: Formatter[]) {
        if (tr instanceof Array) {
            tr.forEach(t => this.formatters.push(t));
        }
    }
    setTransformers(tr: InputTransformer[]) {
        if (tr instanceof Array) {
            tr.forEach(t => this.transformers.push(t));
        }
    }
}

