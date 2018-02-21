import {
    OnChanges,
    ElementRef, Renderer, AfterContentInit, SimpleChanges,
    Input, Output, Directive, OnInit, OnDestroy, EventEmitter, InjectionToken, Optional, DoCheck,
    Self, Inject, Host, IterableDiffers, IterableDiffer, KeyValueDiffers, KeyValueDiffer, forwardRef, SkipSelf
} from "@angular/core";
import {
    NgControl, NgModel, ControlContainer, AsyncValidatorFn, Validator, NgForm, DefaultValueAccessor,
    ValidatorFn, NG_VALIDATORS, NG_VALUE_ACCESSOR, NG_ASYNC_VALIDATORS, ControlValueAccessor,
} from "@angular/forms";
import { setUpControl, cleanUpControl } from "./nbmodels_utils";
import { getMetadata } from "./metadata";
import { StringUtils } from "./utils";
import { Observable, Subject, Subscription } from 'rxjs';
import { NB_CONTROL_RENDERER_TOKEN, ControlRenderer } from './renderer';
import { NBModelAdapter } from './adapter';
import { NBModelState } from './nbstate';
import { NBGroupMember, NbGroup, NB_MODELGROUP_TOKEN } from './nbgroup';
import { NbMetadata } from "./metadata";

export const STATE_NAME = "STATE_NAME";
export const NbModelProvider: any = {
    provide: NgControl,
    useExisting: forwardRef(() => NbModel)
};

export class DifferBuilder {
    differ: KeyValueDiffer<any, any> | IterableDiffer<any>;
    first = true;
    constructor(private differKeys: KeyValueDiffers,
        private differArrays: IterableDiffers) { }
    hasChanged(model: any): boolean {
        if (typeof this.differ != "undefined") {
            if (model instanceof Array) {
                return !!(<any>this.differ).diff(model);
            } else {
                return !!(<any>this.differ).diff(<any>{ model: model });
            }
        } else {
            if (typeof model == "undefined") {
                if (this.first) {
                    this.first = false;
                    return true;
                } else {
                    return false;
                }
            } else {
                if (model instanceof Array) {
                    this.differ = this.differArrays.find([]).create(null);
                    return !!this.differ.diff(model);
                } else {
                    this.differ = this.differKeys.find({}).create();
                    return !!this.differ.diff(<any>{ model: model });
                }
            }
        }
    }
}
@Directive({
    selector: '[nbModel]',
    providers: [NbModelProvider],
    exportAs: 'nbModel'
})
export class NbModel extends NgModel implements OnInit, DoCheck, OnDestroy, OnChanges, NBGroupMember {
    _nbModel: string;
    _disabled = false;
    state: NBModelState;
    differBuilder: DifferBuilder;
    private subscriptions: Array<Subscription> = [];
    @Output() nbModelChange = new EventEmitter();
    @Input() set nbModel(n: string) { this._nbModel = n; }
    get nbModel() { return this._nbModel; }
    constructor( @Optional() @Host() private parent: ControlContainer,
        @Optional() @Self() @Inject(NG_VALIDATORS) validators: Array<Validator | ValidatorFn>,
        @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<AsyncValidatorFn>,
        @Optional() @Self() @Inject(NG_VALUE_ACCESSOR)
        valueAccessors: ControlValueAccessor[],
        /**
         * OTHER DEPS
         */
        @Optional() public differKeys: KeyValueDiffers,
        @Optional() private differArrays: IterableDiffers,
        @Inject(NB_MODELGROUP_TOKEN) private group: NbGroup,
        @Optional() @Inject(NB_CONTROL_RENDERER_TOKEN) private controlRenderers: Array<ControlRenderer>) {
        super(parent, validators, asyncValidators, valueAccessors);
        this.differBuilder = new DifferBuilder(differKeys, differArrays);
    }
    get model() {
        let val = this.group.nbGroup[this._nbModel];
        //AVOID DIFF null!=undefined
        return val === undefined ? null : val;
    }
    set model(model: any) { this.group.nbGroup[this._nbModel] = model; }
    get memberName() { return this._nbModel; }
    findInTree(dep): NbModel {
        return <any>this.group.findInTree(dep);
    }
    findValuesInTree(deps: string[]): any[] {
        return deps.map(dep => {
            let founded = this.findInTree(dep);
            return founded ? founded.value : null;
        });
    }
    skipChanged() {
        this.differBuilder.hasChanged(this.model);
    }
    hasChanged(): boolean {
        return this.differBuilder.hasChanged(this.model);
    }
    get meta(): NbMetadata { return getMetadata(this.group.nbGroup, this._nbModel); }
    ngOnInit() {
        let meta = this.meta;
        this.name = this.group.registerChild(this);
        this.state = new NBModelState(meta, this);
        this.state.set(STATE_NAME, this.name);
        this.model = this.group.nbGroup[this._nbModel];
        //push async validators
        let async: AsyncValidatorFn[] = [].concat(meta.asyncValidators.map(a => a.build(this)));
        async.push(this.control.asyncValidator);
        async = async.filter((a) => a != null);
        this.control.setAsyncValidators(async);
        //push sync validators
        let sync: ValidatorFn[] = [].concat(meta.validators.map(a => a.build(this)));
        sync.push(this.control.validator);
        sync = sync.filter((a) => a != null);
        this.control.setValidators(sync);
        //accessor and transformer
        if (meta.accessor) {
            this.valueAccessor = meta.accessor;
        }
        this.valueAccessor && this.valueAccessor["onNbModelInit"] && this.valueAccessor["onNbModelInit"](this);
        this.valueAccessor = new NBModelAdapter(this.valueAccessor, meta);
        //chain EventEmitter
        this.update.subscribe((value) => {
            this.model = value;
            this.skipChanged();
            this.nbModelChange.emit(value);
        });
        //INIT 
        if (this.formDirective) {
            (<NgForm>this.formDirective).addControl(this);
        } else {
            setUpControl(this.control, this);
            this.control.updateValueAndValidity({ emitEvent: false });
        }
        //SUBSCRIBE ERROR HANDLER
        if (this.controlRenderers) {
            this.controlRenderers.forEach(e => e.bind(this));
            this.subscriptions.push(<any>this.statusChanges.subscribe((a) => {
                this.controlRenderers.forEach(e => e.onValidationChange(this));
            }));
            this.subscriptions.push(<any>this.valueChanges.subscribe((a) => {
                this.controlRenderers.forEach(e => e.onValueChange(this));
            }));
        }
    }
    set isDisabled(b: boolean) {
        this._disabled = b;
        super["_updateDisabled"]({ isDisabled: { currentValue: b } });
    }
    @Input('disabled') get isDisabled() { return this._disabled; }
    ngOnChanges(changes: SimpleChanges) {
    }
    onGroupReady() {
        let meta = this.meta;
        //SUBSRIBE DEPENDENCIES
        meta.dependencies.forEach(dep => {
            let founded: NbModel = <any>this.group.findInTree(dep);
            if (founded == null) {
                throw "Cannot find dependency in the tree:" + dep;
            }
            let subscriptions = founded.listen(this);
            this.subscriptions = this.subscriptions.concat(subscriptions);
        });
    }
    private listen(other: NbModel): Array<Subscription> {
        let subscriptions: Array<Subscription> = [];
        if (this !== other) {
            if (other.controlRenderers && other.controlRenderers.length) {
                subscriptions.push(<any>this.statusChanges.subscribe((a) => {
                    other.controlRenderers.forEach(e => e.onValidationChange(this));
                }));
            }
            subscriptions.push(<any>this.valueChanges.subscribe((a) => {
                if (other.control.enabled) {
                    other.control.updateValueAndValidity({ emitEvent: false });
                } else {
                    other.control["_runValidator"]();
                }
            }));
            this.subscriptions = this.subscriptions.concat(subscriptions);
        }
        return subscriptions;
    }
    ngDoCheck() {
        if (this.hasChanged()) {
            this.modelToView();
        }
    }
    modelToView() {
        this["_updateValue"](this.model);
        this.viewModel = this.model;
    }
    ngOnDestroy() {
        this.group.unregisterChild(this);
        if (this.formDirective) {
            (<NgForm>this.formDirective).removeControl(this);
        }
        this.subscriptions.forEach(u => u.unsubscribe());
        if (this.controlRenderers) {
            this.controlRenderers.forEach(e => e.unbind(this));
        }
    }
}