import { ComponentFixture, TestBed, tick, fakeAsync, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { enableProdMode } from '@angular/core';
import { MinLength, MaxLength, RequiredIf } from "../annotations";
import { AngulatorModule } from "../module";
import { } from 'jasmine'; 
import { NbModel } from "../nbmodel";
import { NbSelectMultipleOption, NBSelectMultipleControlValueAccessor, NBSelectControlValueAccessor, NbSelectOption } from "../accessor";
import { DOMUtils } from "./_utils";
import { User, TestComponentFactory, TestComponent } from "./_test";
import * as moment from "moment";


describe('Testing annotation', () => {

    let fixture: ComponentFixture<TestComponent>;
    let comp: TestComponent;
    let input: DebugElement;
    function init(temp: string, name: string) {
        TestComponentFactory.create(temp);
        tick();
        fixture = <any>TestBed.createComponent(TestComponentFactory.type);
        fixture.detectChanges();
        comp = fixture.componentInstance;
        input = byName(name)
        tick();
    }
    function byName(name: string) {
        return fixture.debugElement.query(By.css(`[nbModel="${name}"]`));
    }

    it('should validate required', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm><input type="text" nbModel="required"/></div>`;
        init(temp, "required");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.valid).toBeFalsy("Should be invalid");
        //
        comp.user.required = "VALUE";
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid from model");
        //
        comp.user.required = null;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeFalsy("Should be invalid from model");
        //
        DOMUtils.inputTextChange(input, "VALUE");
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid from view");
    }));

    it('should validate required IF', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm>
            <input type="checkbox" nbModel="requiredDep"/>
            <input type="text" nbModel="requiredIf"/>
        </div>`;
        init(temp, "requiredIf");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.valid).toBeTruthy("Should be valid because dep false");
        //
        comp.user.requiredDep = true;
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid when deps true");
        //
        comp.user.requiredIf = "VALUE";
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid when non null");
        //
        comp.user.requiredIf = null;
        comp.user.requiredDep = false;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid when all null");
    }));

    it('should validate required TRUE', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm>
            <input type="checkbox" nbModel="requiredTrue"/>
        </div>`;
        init(temp, "requiredTrue");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.invalid).toBeTruthy("Should be invalid");
        //
        comp.user.requiredTrue = true;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid");
    }));
    it('should validate enabled IF', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm>
            <input type="checkbox" nbModel="enabledDep"/>
            <input type="text" nbModel="enabledIf"/>
        </div>`;
        init(temp, "enabledIf");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(input.nativeElement.disabled).toBeTruthy("Should be disabled");
        //
        comp.user.enabledDep = true;
        fixture.detectChanges();
        tick();
        expect(input.nativeElement.disabled).toBeFalsy("Should be enabled");
        //
        comp.user.enabledDep = false;
        fixture.detectChanges();
        tick();
        expect(input.nativeElement.disabled).toBeTruthy("Should be disabled anew");
    }));
    it('should validate disabled IF', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm>
            <input type="checkbox" nbModel="disabledDep"/>
            <input type="text" nbModel="disabledIf"/>
        </div>`;
        init(temp, "disabledIf");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(input.nativeElement.disabled).toBeFalsy("Should be enabled");
        //
        comp.user.disabledDep = true;
        fixture.detectChanges();
        tick();
        expect(input.nativeElement.disabled).toBeTruthy("Should be disabled");
        //
        comp.user.disabledDep = false;
        fixture.detectChanges();
        tick();
        expect(input.nativeElement.disabled).toBeFalsy("Should be enabled anew");
    }));
    it('should validate maxLength IF', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm>
            <input type="text" nbModel="maxLengthDep"/>
            <input type="text" nbModel="maxLengthIf"/>
        </div>`;
        init(temp, "maxLengthIf");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.valid).toBeTruthy("Should be valid (<30)");
        //
        comp.user.maxLengthDep = "0000000000111111111122222";
        tick();
        fixture.detectChanges();
        expect(model.valid).toBeTruthy("Should be valid2 (<30)");
        //
        comp.user.maxLengthIf = "33333";
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid (>30)");
        //
        comp.user.maxLengthIf = "3333";
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid anew (=30)");
    }));
    it('should unaccent', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="unaccent"/>
        </div>`;
        init(temp, "unaccent");
        let model: NbModel = input.injector.get(NbModel);
        //
        DOMUtils.inputTextChange(input, "àéèêùï");
        fixture.detectChanges();
        tick();
        expect(comp.user.unaccent).toBe("aeeeui", "Should model be unaccent");
        expect(input.nativeElement.value).toBe("aeeeui", "Should value be unaccent");

    }));
    it('should capitalize', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="captitalize"/>
        </div>`;
        init(temp, "captitalize");
        let model: NbModel = input.injector.get(NbModel);
        //
        DOMUtils.inputTextChange(input, "abcd efg");
        fixture.detectChanges();
        tick();
        expect(comp.user.captitalize).toBe("Abcd Efg", "Should model be capitalized");
        expect(input.nativeElement.value).toBe("Abcd Efg", "Should value be capitalized");
    })); 
    it('should validate maxLength', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="maxlength"/>
        </div>`;
        init(temp, "maxlength");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.valid).toBeTruthy("Should be valid (<5)");
        //
        comp.user.maxlength = "123456";
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid (>5)");
        //
        comp.user.maxlength = "12345";
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid anew (=30)");
    }));
    it('should validate minlength', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="minlength"/>
        </div>`;
        init(temp, "minlength");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.invalid).toBeTruthy("Should be invalid (<5)");
        //
        comp.user.minlength = "123456";
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (>5)");
        //
        comp.user.minlength = "12345";
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid anew (=5)");
    }));
    it('should validate length', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="length"/>
        </div>`;
        init(temp, "length");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.invalid).toBeTruthy("Should be invalid (<5)");
        //
        comp.user.length = "123456";
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid (>5)");
        //
        comp.user.length = "12345";
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid anew (=5)");
    }));
    it('should validate min', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="number" nbModel="min"/>
        </div>`;
        init(temp, "min");
        let model: NbModel = input.injector.get(NbModel);
        //
        comp.user.min = 5;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (=5)");
        //
        comp.user.min = 4;
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid (<5)");
        //
        comp.user.min = 6;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (>5)");
    }));
    it('should validate max', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="number" nbModel="max"/>
        </div>`;
        init(temp, "max");
        let model: NbModel = input.injector.get(NbModel);
        //
        comp.user.max = 5;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (=5)");
        //
        comp.user.max = 4;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (<5)");
        //
        comp.user.max = 6;
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid (>5)");
    }));
    it('should validate isequal', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="number" nbModel="isequal"/>
        </div>`;
        init(temp, "isequal");
        let model: NbModel = input.injector.get(NbModel);
        //
        comp.user.isequal = 4;
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid (!=5)");
        //
        comp.user.isequal = 5;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (=5)");
    }));
    it('should validate min date', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="date" nbModel="minDate"/>
        </div>`;
        init(temp, "minDate");
        let model: NbModel = input.injector.get(NbModel);
        // 
        comp.user.minDate = moment().startOf('day').toDate();
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (=today)");
        //
        comp.user.minDate = moment().startOf('day').add(-1, "hours").toDate();
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid (<today)");
        //
        comp.user.minDate = moment().startOf('day').add(1, "hours").toDate();
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (>today)");
    }));
    it('should validate max date', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="date" nbModel="maxDate"/>
        </div>`;
        init(temp, "maxDate");
        let model: NbModel = input.injector.get(NbModel);
        // 
        comp.user.maxDate = moment().startOf('day').toDate();
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (=today)");
        //
        comp.user.maxDate = moment().startOf('day').add(1, "hours").toDate();
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid (>today)");
        //
        comp.user.maxDate = moment().startOf('day').add(-1, "hours").toDate();
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (<today)");
    }));
    it('should validate min array', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="minArray"/>
        </div>`;
        init(temp, "minArray");
        let model: NbModel = input.injector.get(NbModel);
        // 
        comp.user.minArray = [1, 2, 3, 4, 5];
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (=min)");
        //
        comp.user.minArray = [1, 2, 3, 4]
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid (<min)");
        //
        comp.user.minArray = [1, 2, 3, 4, 5, 6];
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (>min)");
    }));
    it('should validate max array', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="maxArray"/>
        </div>`;
        init(temp, "maxArray");
        let model: NbModel = input.injector.get(NbModel);
        // 
        comp.user.maxArray = [1, 2, 3, 4, 5];
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (=max)");
        //
        comp.user.maxArray = [1, 2, 3, 4, 5, 6];
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid (>max)");
        //
        comp.user.maxArray = [1, 2, 3, 4]
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (<max)");
    }));
    it('should validate range', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="number" nbModel="range"/>
        </div>`;
        init(temp, "range");
        let model: NbModel = input.injector.get(NbModel);
        //
        comp.user.range = 4;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (=max)");
        //
        comp.user.range = 2;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (=min)");
        //
        comp.user.range = 3;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (in range)");
        //
        comp.user.range = 5;
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid (>max)");
        //
        comp.user.range = 1;
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid (<min)");
    }));
    it('should validate pattern', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="pattern"/>
        </div>`;
        init(temp, "pattern");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.valid).toBeTruthy("Should be valid: null");
        //
        comp.user.pattern = "ddddd";
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (only d)");
        //
        comp.user.pattern = "aaaa";
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid anew (no d)");
    }));
    it('should validate ip', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="isip"/>
        </div>`;
        init(temp, "isip");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.valid).toBeTruthy("Should be valid: null");
        //
        comp.user.isip = "192.26.2.2";
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (ip ok)");
        //
        comp.user.isip = "26.26.2";
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid anew (no ip)");
    }));
    it('should validate digits', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="digits"/>
        </div>`;
        init(temp, "digits");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.valid).toBeTruthy("Should be valid: null");
        //
        comp.user.digits = "123456";
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (only digits)");
        //
        comp.user.digits = "123456a";
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid anew (alphanum)");
    }));
    it('should validate dateiso', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="dateiso"/>
        </div>`;
        init(temp, "dateiso");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.valid).toBeTruthy("Should be valid: null");
        //
        comp.user.dateiso = "2017-06-06";
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (iso)");
        //
        comp.user.dateiso = "06-06-2017";
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid anew (not iso)");
    }));
    it('should validate email', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="isemail"/>
        </div>`;
        init(temp, "isemail");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.valid).toBeTruthy("Should be valid: null");
        //
        comp.user.isemail = "nabil@mansouri.com";
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (is email)");
        //
        comp.user.isemail = "nabil.com";
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid anew (not email)");
    }));
    it('should validate isdate', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="isdate"/>
        </div>`;
        init(temp, "isdate");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.valid).toBeTruthy("Should be valid: null");
        //
        comp.user.isdate = new Date();
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (is date)");
        //
        comp.user.isdate = <any>"50445045-06-06";
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid anew (not date)");
    }));
    it('should validate url', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="isurl"/>
        </div>`;
        init(temp, "isurl");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.valid).toBeTruthy("Should be valid: null");
        //
        comp.user.isurl = "http://nabil.com";
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (is url)");
        //
        comp.user.isurl = "nabil.com";
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid anew (not url)");
    }));
    it('should validate number', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="isnumber"/>
        </div>`;
        init(temp, "isnumber");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.valid).toBeTruthy("Should be valid: null");
        //
        comp.user.isnumber = 5;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (isnumber)");
        //
        comp.user.isnumber = <any>"s";
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid anew (not isnumber)");
    }));
    it('should validate dategt', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm>
            <input type="text" nbModel="dategtDep"/>
            <input type="text" nbModel="dategt"/>
        </div>`;
        init(temp, "dategt");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.valid).toBeTruthy("Should be valid because dep null");
        //
        comp.user.dategtDep = new Date();
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid because value null");
        //
        comp.user.dategt = new Date(comp.user.dategtDep.getTime() + 10);
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid because greater");
        //
        comp.user.dategt = comp.user.dategtDep;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid because equal");
        //
        comp.user.dategt = new Date(comp.user.dategtDep.getTime() - 10);
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid because less");
        //
        comp.user.dategtDep = null;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid when dep null");
    }));
    it('should validate datelt', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm>
            <input type="text" nbModel="dateltDep"/>
            <input type="text" nbModel="datelt"/>
        </div>`;
        init(temp, "datelt");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.valid).toBeTruthy("Should be valid because dep null");
        //
        comp.user.dateltDep = new Date();
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid because value null");
        //
        comp.user.datelt = new Date(comp.user.dateltDep.getTime() - 10);
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid because less");
        //
        comp.user.datelt = comp.user.dateltDep;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid because equal");
        //
        comp.user.datelt = new Date(comp.user.dateltDep.getTime() + 10);
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid because greater");
        //
        comp.user.dateltDep = null;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid when dep null");
    }));
    it('should validate phone', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="isphone"/>
        </div>`;
        init(temp, "isphone");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(model.valid).toBeTruthy("Should be valid: null");
        //
        comp.user.isphone = "(06) 00-00-00-00";
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid (is phone)");
        //
        comp.user.isphone = "(06) 00-00-00";
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid anew (not phone)");
    }));
});
