import { AsyncValidatorFn, Validator, ValidatorFn, ControlValueAccessor } from "@angular/forms";
import "reflect-metadata";
import { SyncValidator, ASyncValidator } from "./validators";
import { InputTransformer, Formatter, Parser } from "./adapter";
import { NBModelStateListener } from "./nbstate";

export class NbMetadata {
    public static DEFAULT_STATES_LISTNERS: NBModelStateListener[] = [];
    // re-run validation with registerOnValidatorChange when validator binding changes, e.g. minlength=3 -> minlength=4
    validators: SyncValidator[] = [];
    inputTransformers: InputTransformer[] = [];
    formatters: Formatter[] = [];
    parsers: Parser[] = [];
    stateListener: NBModelStateListener[] = [];
    asyncValidators: ASyncValidator[] = [];
    accessor: ControlValueAccessor = null;
    dependencies: string[] = [];
    constructor() {
        this.stateListener = this.stateListener.concat(NbMetadata.DEFAULT_STATES_LISTNERS);
    }
    addDeps(dep: string[]) {
        //PUSH UNIQ
        dep.forEach(d => {
            if (this.dependencies.indexOf(d) == -1) {
                this.dependencies.push(d);
            }
        });
    }
}

export class NbMetadatas {
    values: Map<string, NbMetadata> = new Map();
    getOrCreate(key: string) {
        if (!this.values.has(key)) {
            this.values.set(key, new NbMetadata);
        }
        return this.values.get(key);
    }
}
const META_KEY = "nb.metadata.";
export function getMetadatas(target: any): NbMetadatas {
    if (!Reflect.hasMetadata(META_KEY, target)) {
        Reflect.defineMetadata(META_KEY, new NbMetadatas, target);
    }
    return Reflect.getMetadata(META_KEY, target);
}
export function getMetadata(target: any, property: string): NbMetadata {
    let all: NbMetadatas = getMetadatas(target);
    return all.getOrCreate(property);
}

