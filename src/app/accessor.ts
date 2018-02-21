import { ChangeDetectorRef, Inject, InjectionToken, Optional, Host, Directive, ElementRef, Renderer2, HostBinding, forwardRef, Injector, IterableDiffer, IterableDiffers } from '@angular/core';
import {
    ControlValueAccessor, NG_VALUE_ACCESSOR, DefaultValueAccessor, SelectMultipleControlValueAccessor,
    CheckboxControlValueAccessor, RadioControlValueAccessor, SelectControlValueAccessor,
    NgSelectOption, ɵbc as NumberValueAccessor
} from '@angular/forms';
import * as forms from '@angular/forms';
import { NbModel } from "./nbmodel";
import { state } from "./state_keys";
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks'; 
import { NgSelectMultipleOption } from "./accessor_utils";
 
const NBDEFAULT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NBDefaultValueAccessor),
    multi: true
};
@Directive({
    selector: 'input:not([type=checkbox]):not([type=number]):not([type=radio])[nbModel],textarea[nbModel]',
    host: { '(input)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
    providers: [NBDEFAULT_VALUE_ACCESSOR]
})
export class NBDefaultValueAccessor extends DefaultValueAccessor implements OnDestroy {
    name: string;
    maxLength = null;
    subscribe: () => void;
    constructor(_renderer: Renderer2, public _el: ElementRef) {
        super(_renderer, _el, true);
    }
    onNbModelInit(model: NbModel) {
        this.name = model.name;
        const self = this;
        this.subscribe = model.state.listen({
            stateKeys(): string[] | string {
                return [state.MAX_LENGTH,
                state.READONLY,
                state.MAX_DATE,
                state.MIN_DATE,
                state.MIN_LENGTH];
            },
            stateChanged(key: string, value: any, model: NbModel) {
                switch (key) {
                    case state.MAX_LENGTH:
                        self.maxLength = value;
                        self._el.nativeElement.maxLength = value;
                        break;
                    case state.MIN_LENGTH:
                        self._el.nativeElement.minLength = value;
                        break;
                    case state.MIN_DATE:
                        self._el.nativeElement.minDate = value;
                        break;
                    case state.MAX_DATE:
                        self._el.nativeElement.maxDate = value;
                        break;
                    case state.READONLY:
                        self._el.nativeElement.readonly = true;
                        break;
                }
            }
        })
    }
    ngOnDestroy() {
        this.subscribe && this.subscribe();
    }
    @HostBinding('attr.maxlength') get maxLengthNative() {
        return this.maxLength;
    }
    @HostBinding('attr.name') get nameNative() {
        return this.name;
    }
}


export const NBCHECKBOX_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NBCheckboxControlValueAccessor),
    multi: true,
};
@Directive({
    selector:
        'input[type=checkbox][nbModel]',
    host: { '(change)': 'onChange($event.target.checked)', '(blur)': 'onTouched()' },
    providers: [NBCHECKBOX_VALUE_ACCESSOR]
})
export class NBCheckboxControlValueAccessor extends CheckboxControlValueAccessor {
    name: string;
    constructor(_renderer: Renderer2, _elementRef: ElementRef) {
        super(_renderer, _elementRef);
    }
    @HostBinding('attr.name') get nameNative() {
        return this.name;
    }
    onNbModelInit(model: NbModel) {
        this.name = model.name;
    }
}

export const NBNUMBER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NBNumberValueAccessor),
    multi: true
};

@Directive({
    selector:
        'input[type=number][nbModel]',
    host: {
        '(change)': 'onChange($event.target.value)',
        '(input)': 'onChange($event.target.value)',
        '(blur)': 'onTouched()'
    },
    providers: [NBNUMBER_VALUE_ACCESSOR]
})
export class NBNumberValueAccessor extends NumberValueAccessor {
    name: string;
    constructor(_renderer: Renderer2, _elementRef: ElementRef) {
        super(_renderer, _elementRef);
    }
    @HostBinding('attr.name') get nameNative() {
        return this.name;
    }
    onNbModelInit(model: NbModel) {
        this.name = model.name;
    }
}


export const NBRADIO_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NBRadioControlValueAccessor),
    multi: true
};

@Directive({
    selector:
        'input[type=radio][nbModel]',
    host: {
        '(change)': 'onChange($event.target.value)',
        '(input)': 'onChange($event.target.value)',
        '(blur)': 'onTouched()'
    },
    providers: [NBRADIO_VALUE_ACCESSOR]
})
export class NBRadioControlValueAccessor extends RadioControlValueAccessor { 
    onNbModelInit(model: NbModel) {
        this.name = model.name;
    }
    @HostBinding('attr.name') get nameNative() {
        return this.name;
    }
}


export const NBSELECT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NBSelectControlValueAccessor),
    multi: true
};
const OPTION_TOKEN = new InjectionToken("OPTION_TOKEN");
const SELECT_PROVIDER: any = {
    provide: OPTION_TOKEN,
    useExisting: forwardRef(() => NBSelectControlValueAccessor),
    multi: false
};

@Directive({
    selector:
        'select:not([multiple])[nbModel]',
    host: {
        '(change)': 'onChange($event.target.value)',
        '(input)': 'onChange($event.target.value)',
        '(blur)': 'onTouched()'
    },
    providers: [NBSELECT_VALUE_ACCESSOR, SELECT_PROVIDER],

})
export class NBSelectControlValueAccessor extends SelectControlValueAccessor {
    name: string;
    constructor(_renderer: Renderer2, _elementRef: ElementRef) {
        super(_renderer, _elementRef);
    }
    onNbModelInit(model: NbModel) {
        this.name = model.name;
    }
    @HostBinding('attr.name') get nameNative() {
        return this.name;
    }
}

@Directive({ selector: 'option' })
export class NbSelectOption extends NgSelectOption {
    constructor(
        _element: ElementRef, @Optional() @Inject(Renderer2) _renderer: Renderer2, @Optional() @Inject(OPTION_TOKEN) _select: NBSelectControlValueAccessor) {
        super(_element, _renderer, _select);
    }
}


export const NBSELECTMULTIPLE_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NBSelectMultipleControlValueAccessor),
    multi: true
};
const MULTIPLEOPTION_TOKEN = new InjectionToken("MULTIPLEOPTION_TOKEN");
const SELECTMULTIPLE_PROVIDER: any = {
    provide: MULTIPLEOPTION_TOKEN,
    useExisting: forwardRef(() => NBSelectMultipleControlValueAccessor),
    multi: false
};
@Directive({
    selector:
        'select:[multiple][nbModel]',
    host: { '(change)': 'onChange($event.target)', '(blur)': 'onTouched()' },
    providers: [NBSELECTMULTIPLE_VALUE_ACCESSOR, SELECTMULTIPLE_PROVIDER]
})
export class NBSelectMultipleControlValueAccessor extends SelectMultipleControlValueAccessor {
    name: string;
    constructor(_renderer: Renderer2, _elementRef: ElementRef, private differs: IterableDiffers) {
        super(_renderer, _elementRef);
    }
    onNbModelInit(model: NbModel) {
        this.name = model.name;
    }
    @HostBinding('attr.name') get nameNative() {
        return this.name;
    }
}
@Directive({ selector: 'option' })
export class NbSelectMultipleOption extends NgSelectMultipleOption {
    constructor(_element: ElementRef, @Inject(Renderer2) _renderer: Renderer2, @Optional() @Inject(MULTIPLEOPTION_TOKEN) _select: NBSelectMultipleControlValueAccessor) {
        super(_element, _renderer, _select);
    }
}

export const ACCESSORS = [NBDefaultValueAccessor, NBCheckboxControlValueAccessor,
    NBNumberValueAccessor, NBRadioControlValueAccessor, NBSelectControlValueAccessor,
    NBSelectMultipleControlValueAccessor, NbSelectMultipleOption, NbSelectOption];