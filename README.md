# angulator
An angular plugin to validate forms using annotation on model.

# Author
Nabil MANSOURI

# How to use it
## 1- Import dependency
`npm i --save angulator`

## 2- Samples
See demo folder!
Or run npm test

### Import module

```typescript
import {
  AngulatorModule
} from "angulator";


@NgModule({
  declarations: [
  ],
  imports: [
    AngulatorModule 
  ],
  bootstrap: []
})
export class AppModule {
}
```

### Annotate model

```typescript
import {
  MinLength, MaxLength, EnabledIf, MaxLengthIf, DisabledIf, Capitalize,
  RequiredIf, Required, RequiredTrue, Length, IsEqual, Min, Max,
  MinDate, MaxDate, MinArray, MaxArray, Range, Pattern,
  IsIP, Digits, DateIso, IsEmail, IsDate, IsUrl, IsNumber,
  DateGt, DateLt, Phone, Unaccent, ReadOnly, DateLimit
} from "angulator"; 

export class User {
  @MinLength(5) @MaxLength(10) name: string;
  hasBrother: boolean;
  age: number;
  sexe: string;
  happy: string;
  colors = [];
  @RequiredIf("hasBrother", true) brother: string;
  //OTHER 
  @Required() required: string;
  @RequiredTrue() requiredTrue: boolean;
  requiredDep: boolean;
  @RequiredIf("requiredDep") requiredIf: string;
  enabledDep: boolean;
  @EnabledIf("enabledDep") enabledIf: string;
  disabledDep: boolean;
  @DisabledIf("disabledDep") disabledIf: string;
  maxLengthDep: string;
  @MaxLengthIf("maxLengthDep", 30, " ") maxLengthIf: string;
  @Unaccent() unaccent: string;
  @Capitalize() captitalize: string;
  @ReadOnly() readonly: string;
  @MinLength(5) minlength: string;
  @MaxLength(5) maxlength: string;
  @Length(5) length: string;
  @IsEqual(5) isequal: number;
  @Min(5) min: number;
  @Max(5) max: number;
  @MinDate(DateLimit.Today) minDate: Date;
  @MaxDate(DateLimit.Today) maxDate: Date;
  @MinArray(5) minArray: number[] = [];
  @MaxArray(5) maxArray: number[] = [];
  @Range(2, 4) range: number;
  @Pattern(/d+/) pattern: string;
  @IsIP() isip: string;
  @Digits() digits: string;
  @DateIso() dateiso: string;
  @IsEmail() isemail: string;
  @IsDate() isdate: Date;
  @IsUrl() isurl: string;
  @IsNumber() isnumber: number;
  dategtDep: Date;
  @DateGt("dategtDep") dategt: Date;
  dateltDep: Date;
  @DateLt("dateltDep") datelt: Date;
  @Phone() isphone: string;
}
```

### Add the directive on template

```html
<div [nbGroup]="user" ngForm>
    <div >
        Name:
        <input type="text" nbModel="name" class="name" (nbModelChange)="changed()" />
    </div>
    <div>
        Has brother:
        <input type="checkbox" nbModel="hasBrother" class="hasBrother" (nbModelChange)="changedCheck()" />
    </div>
    <div>
        <input type="text" nbModel="brother" class="brother" />
    </div>
    <div>
        <input type="number" nbModel="age" class="age" (nbModelChange)="changedNum()" />
    </div>
    <div>
        <input type="radio" nbModel="sexe" class="girl" value="girl" (nbModelChange)="changedRadio()" />
    </div>
    <div>
        <input type="radio" nbModel="sexe" class="boy" value="boy" (nbModelChange)="changedRadio()" />
    </div>
    <div>
        <select nbModel="happy" class="happy" (nbModelChange)="changedSelect()">
            <option value="yes" class="yes">YES</option>
            <option value="no" class="no">NO</option>
        </select>
    </div>
    <div>
        <select multiple nbModel="colors" class="colors" (nbModelChange)="changedSelect()">
            <option value="blue" class="blue">blue</option>
            <option value="yellow" class="yellow">yellow</option>
            <option value="green" class="green">green</option>
        </select>
    </div>
</div>
```

# How does it works?
This module provide two directives "nbGroup" and "nbModel".
These directives extends "ngModel" and add some validators automatically.
"nbModel" manage a state that let accessor listen and modify the DOM if needed. For example @MaxLength change the state of the model and the default accessor will add a property "maxLength" on the DOM.

# List of annotation
## MinLength, MaxLength, Length
Accept an integer as parameter.
It validates that the input field (string) has a length greater (or smaller) than the value provide as parameter.
It also add an attribute "maxLength" (or "minLength") to the DOM element.

## EnabledIf, DisabledIf
Accept a string or an array of string (dependencies) as parameter.
The field is disabled or enabled according to the dependencies. Dependencies are others fields that we need to listen in order to update the state of the model.
For exemple: a checkbox "hasName" could enable or disable the field "name".
So "name" will be annoted by @EnabledIf("hasName")

## MaxLengthIf
Accept a string or an array of string (dependencies) as parameter and an integer (maxLength)
The maxlength of the field is computed according to dependencies fields.
For example, you could have a phone number with a maxlength of 10 and another field prefix. If prefix is filled, maxlength of phone is: maxlength-length(prefix).

## Capitalize
It automatically capitalize the input while typing

## RequiredIf
The field is required or not according to the dependencies. Dependencies are others fields that we need to listen in order to update the state of the model.
For exemple: a checkbox "isRequired" could force the field "name".

## Required
The field is required

## RequiredTrue
Apply to a checkbox. The checkbox must be checked by the user.

## IsEqual, Min, Max,Range
Accept an integer as parameter.
The number must be equal (or greater or smaller) than the value.

## MinDate, MaxDate
Accept a date or a constant (TOday, Now...)
The date must be greater (or smaller) than the value.

## MinArray, MaxArray
Accept an integer as parameter.
The collection length must be greater (or smaller) than the value.

## Pattern
Accept a regex or a string as parameter.
The value must match the regex.

## IsIP
The value must be an IP address

## Digits
The value must contains only digits

## DateIso
The value must be a date with format : YYYY-MM-DD

## IsEmail
The value must be an email

## IsDate
THe value must be a valid date

## IsUrl
THe value must be an URL.

## IsNumber
The value must be a valid number (input type number)

## DateGt, DateLt
Accept a string or an array of string (dependencies) as parameter.
The value must be greater (or smaller) than the dependency value.
The aim is to validate one date regarding another.

## Phone
The value must be a valid phone

## Unaccent
Automatically unaccent the text while the user is typing.

## ReadOnly
The field is a read only field


# TODO
- externalize validator in order to make a backend validation using the same model
- externalize accessor because it is platform dependent (web)
- extend to make it available for nativescript (mobile apps)
