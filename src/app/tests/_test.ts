import { ComponentFixture, TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { enableProdMode } from '@angular/core';
import {
    MinLength, MaxLength, EnabledIf, MaxLengthIf, DisabledIf, Capitalize,
    RequiredIf, Required, RequiredTrue, Length, IsEqual, Min, Max,
    MinDate, MaxDate, MinArray, MaxArray, Range, Pattern,
    IsIP, Digits, DateIso, IsEmail, IsDate, IsUrl, IsNumber,
    DateGt, DateLt, Phone, Unaccent, ReadOnly, DateLimit
} from "../annotations";
import { AngulatorModule } from "../module";
import { NbModel } from "../nbmodel";


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

export class TestComponent {
    user = new User();
    count = 0;
    countCheck = 0;
    countSelect = 0;
    countNum = 0;
    countRadio = 0;
    colors = [];
    changed() { this.count++; }
    changedSelect() { this.countSelect++; }
    changedCheck() { this.countCheck++; }
    changedNum() { this.countNum++; }
    changedRadio() { this.countRadio++; }

}

export class TestComponentFactory {
    static type = null;
    static create(template: string = null) {
        let realTemplate = template != null ? template : `
        <div [nbGroup]="user" ngForm>
            <input type="text" nbModel="name" class="name" (nbModelChange)="changed()"/>
            <input type="checkbox" nbModel="hasBrother" class="hasBrother" (nbModelChange)="changedCheck()"/>
            <input type="text" nbModel="brother" class="brother" />
            <input type="number" nbModel="age" class="age" (nbModelChange)="changedNum()"/>
            <input type="radio" nbModel="sexe" class="girl" value="girl"   (nbModelChange)="changedRadio()"/>
            <input type="radio" nbModel="sexe" class="boy" value="boy" (nbModelChange)="changedRadio()"/>
            <select nbModel="happy" class="happy" (nbModelChange)="changedSelect()">
                <option value="yes" class="yes">YES</option>
                <option value="no" class="no">NO</option>
            </select>
            <select multiple nbModel="colors" class="colors" (nbModelChange)="changedSelect()">
                <option value="blue" class="blue">blue</option>
                <option value="yellow" class="yellow">yellow</option>
                <option value="green" class="green">green</option>
            </select>  
        </div>
        `;
        @Component({
            selector: 'test',
            template: realTemplate
        })
        class TestComponentInner extends TestComponent {
            user = new User();
            count = 0;
            countCheck = 0;
            countSelect = 0;
            countNum = 0;
            countRadio = 0;
            colors = [];
            changed() { this.count++; }
            changedSelect() { this.countSelect++; }
            changedCheck() { this.countCheck++; }
            changedNum() { this.countNum++; }
            changedRadio() { this.countRadio++; }

        }
        TestComponentFactory.type = TestComponentInner;
        TestBed.configureTestingModule({
            imports: [AngulatorModule, FormsModule],
            declarations: [TestComponentInner]
        }).compileComponents()
    }
}