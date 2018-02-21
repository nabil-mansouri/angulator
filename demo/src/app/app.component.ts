import { Component, Injectable, Renderer2 } from '@angular/core';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  user = new User();  
}
