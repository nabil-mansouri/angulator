import { Validators } from "@angular/forms";

function _throwError(dir, message: string): void {
    let messageEnd: string;
    if (dir.path!.length > 1) {
        messageEnd = `path: '${dir.path!.join(' -> ')}'`;
    } else if (dir.path![0]) {
        messageEnd = `name: '${dir.path}'`;
    } else {
        messageEnd = 'unspecified name attribute';
    }
    throw new Error(`${message} ${messageEnd}`);
}
export function setUpControl(control, dir): void {
    if (!control) _throwError(dir, 'Cannot find control with');
    if (!dir.valueAccessor) _throwError(dir, 'No value accessor for form control with');

    control.validator = Validators.compose([control.validator!, dir.validator]);
    control.asyncValidator = Validators.composeAsync([control.asyncValidator!, dir.asyncValidator]);
    dir.valueAccessor!.writeValue(control.value);

    setUpViewChangePipeline(control, dir);
    setUpModelChangePipeline(control, dir);

    setUpBlurPipeline(control, dir);

    if (dir.valueAccessor!.setDisabledState) {
        control.registerOnDisabledChange(
            (isDisabled: boolean) => { dir.valueAccessor!.setDisabledState!(isDisabled); });
    }

    // re-run validation when validator binding changes, e.g. minlength=3 -> minlength=4
    dir._rawValidators.forEach((validator) => {
        if ((validator).registerOnValidatorChange)
            (validator).registerOnValidatorChange!(() => control.updateValueAndValidity());
    });

    dir._rawAsyncValidators.forEach((validator) => {
        if ((validator).registerOnValidatorChange)
            (validator).registerOnValidatorChange!(() => control.updateValueAndValidity());
    });
}

function setUpViewChangePipeline(control, dir): void {
    dir.valueAccessor!.registerOnChange((newValue: any) => {
        control._pendingValue = newValue;
        control._pendingChange = true;
        control._pendingDirty = true;

        if (control.updateOn === 'change') updateControl(control, dir);
    });
}
function setUpBlurPipeline(control, dir): void {
    dir.valueAccessor!.registerOnTouched(() => {
        control._pendingTouched = true;

        if (control.updateOn === 'blur' && control._pendingChange) updateControl(control, dir);
        if (control.updateOn !== 'submit') control.markAsTouched();
    });
}

function updateControl(control, dir): void {
    dir.viewToModelUpdate(control._pendingValue);
    if (control._pendingDirty) control.markAsDirty();
    control.setValue(control._pendingValue, { emitModelToViewChange: false });
    control._pendingChange = false;
}

function setUpModelChangePipeline(control, dir): void {
    control.registerOnChange((newValue: any, emitModelEvent: boolean) => {
        // control -> view
        dir.valueAccessor!.writeValue(newValue);

        // control -> ngModel
        if (emitModelEvent) dir.viewToModelUpdate(newValue);
    });
}

function _noControlError(dir) {
    return _throwError(dir, 'There is no FormControl instance attached to form control element with');
}


export function cleanUpControl(control, dir) {
    dir.valueAccessor!.registerOnChange(() => _noControlError(dir));
    dir.valueAccessor!.registerOnTouched(() => _noControlError(dir));

    dir._rawValidators.forEach((validator: any) => {
        if (validator.registerOnValidatorChange) {
            validator.registerOnValidatorChange(null);
        }
    });

    dir._rawAsyncValidators.forEach((validator: any) => {
        if (validator.registerOnValidatorChange) {
            validator.registerOnValidatorChange(null);
        }
    });

    if (control) control._clearChangeFns();
}