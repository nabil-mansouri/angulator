import { DebugElement } from '@angular/core';


export class DOMUtils {
    static inputTextChange(input: DebugElement, value: string | number) {
        input.triggerEventHandler("compositionstart", null);
        input.nativeElement.value = value;
        input.nativeElement.dispatchEvent(new Event('input'));
        input.triggerEventHandler("compositionend", null);
    }
    static inputCheckChange(input: DebugElement, value: boolean) {
        input.nativeElement.checked = value; 
        input.nativeElement.dispatchEvent(new Event('change'));
        input.triggerEventHandler("click", null);
    }
    static inputSelectChange(input: DebugElement, value: boolean) {
        input.nativeElement.checked = value; 
        input.nativeElement.dispatchEvent(new Event('change'));
        input.triggerEventHandler("click", null);
    }
    static selectoptionChange(input: DebugElement, value: string) {
        input.nativeElement.value = value; 
        input.nativeElement.dispatchEvent(new Event('change'));
        input.triggerEventHandler("click", null);
    }
    static selectoptionMultipleChange(select: DebugElement, optin: DebugElement) {
        optin.nativeElement.selected = true; 
        select.nativeElement.dispatchEvent(new Event('change'));
    }
}