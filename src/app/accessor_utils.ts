import { OnDestroy, Input, ChangeDetectorRef, Inject, InjectionToken, Optional, Host, Directive, ElementRef, Renderer2, HostBinding, forwardRef, Injector, IterableDiffer, IterableDiffers } from '@angular/core';
import { SelectMultipleControlValueAccessor } from "@angular/forms";

function _buildValueString(id: string, value: any): string {
    if (id == null) return `${value}`;
    if (typeof value === 'string') value = `'${value}'`;
    if (value && typeof value === 'object') value = 'Object';
    return `${id}: ${value}`.slice(0, 50);
}

@Directive({ selector: 'option' })
export class NgSelectMultipleOption implements OnDestroy {
    id: string;
    /** @internal */
    _value: any;

    constructor(
        private _element: ElementRef, private _renderer: Renderer2,
        @Optional() @Host() private _select: SelectMultipleControlValueAccessor) {
        if (this._select) {
            this.id = (<any>this._select)._registerOption(this);
        }
    }

    @Input('ngValue')
    set ngValue(value: any) {
        if (this._select == null) return;
        this._value = value;
        this._setElementValue(_buildValueString(this.id, value));
        this._select.writeValue(this._select.value);
    }

    @Input('value')
    set value(value: any) {
        if (this._select) {
            this._value = value;
            this._setElementValue(_buildValueString(this.id, value));
            this._select.writeValue(this._select.value);
        } else {
            this._setElementValue(value);
        }
    }

    /** @internal */
    _setElementValue(value: string): void {
        this._renderer.setProperty(this._element.nativeElement, 'value', value);
    }

    /** @internal */
    _setSelected(selected: boolean) {
        this._renderer.setProperty(this._element.nativeElement, 'selected', selected);
    }

    ngOnDestroy(): void {
        if (this._select) {
            (<any>this._select)._optionMap.delete(this.id);
            this._select.writeValue(this._select.value);
        }
    }
}