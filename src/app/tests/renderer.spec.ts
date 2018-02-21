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


describe('Testing renderer', () => {

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


    it('should enableif', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm>
            <input type="checkbox" nbModel="disabledDep"/>
            <input type="text" nbModel="disabledIf"/>
        </div>`;
        init(temp, "disabledIf");
        let model: NbModel = input.injector.get(NbModel);
        // 
        comp.user.disabledDep = true;
        fixture.detectChanges();
        tick();
        expect(input.nativeElement.disabled).toBeTruthy("Should element be disabled");
        //
        comp.user.disabledDep = false;
        fixture.detectChanges();
        tick();
        expect(input.nativeElement.disabled).toBeFalsy("Should element be enabled");
    }));

    it('should disableif', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm>
            <input type="checkbox" nbModel="disabledDep"/>
            <input type="text" nbModel="disabledIf"/>
        </div>`;
        init(temp, "disabledIf");
        let model: NbModel = input.injector.get(NbModel);
        //
        tick();
        fixture.detectChanges();
        expect(input.nativeElement.disabled).toBeFalsy("Should element be enabled");
        //
        comp.user.disabledDep = true;
        fixture.detectChanges();
        tick();
        expect(input.nativeElement.disabled).toBeTruthy("Should element be disabled");
    }));

    it('should maxlengthif', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm>
            <input type="text" nbModel="maxLengthDep"/>
            <input type="text" nbModel="maxLengthIf"/>
        </div>`;
        init(temp, "maxLengthIf");
        let model: NbModel = input.injector.get(NbModel);
        //
        fixture.detectChanges();
        tick();
        expect(input.nativeElement.maxLength).toBe(30, "Should element be maxlength");
        // 
        comp.user.maxLengthDep = "00000";
        fixture.detectChanges();
        tick();
        expect(input.nativeElement.maxLength).toBe(25, "Should element be maxlength");
    }));
    it('should readonly', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="readonly"/>
        </div>`;
        init(temp, "readonly");
        let model: NbModel = input.injector.get(NbModel);
        //
        expect(input.nativeElement.readonly).toBeTruthy("Should element be readonly");
    }));
    it('should maxlength', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="maxlength"/>
        </div>`;
        init(temp, "maxlength");
        let model: NbModel = input.injector.get(NbModel);
        //
        expect(input.nativeElement.maxLength).toBe(5, "Should element be maxlength");
    }));
    it('should length', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="length"/>
        </div>`;
        init(temp, "length");
        let model: NbModel = input.injector.get(NbModel);
        //
        expect(input.nativeElement.maxLength).toBe(5, "Should element be maxlength");
    }));
    it('should mindate', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="minDate"/>
        </div>`;
        init(temp, "minDate");
        let model: NbModel = input.injector.get(NbModel);
        //
        let min = moment().format("YYYY-MM-DD")
        expect(input.nativeElement.minDate).toBe(min, "Should element be minDate");
    }));
    it('should maxdate', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="maxDate"/>
        </div>`;
        init(temp, "maxDate");
        let model: NbModel = input.injector.get(NbModel);
        //
        let max = moment().format("YYYY-MM-DD")
        expect(input.nativeElement.maxDate).toBe(max, "Should element be maxDate");
    }));
    //TODO  
    xit('should phone', fakeAsync(() => {
        let temp = `<div [nbGroup]="user" ngForm> 
            <input type="text" nbModel="isphone"/>
        </div>`;
        init(temp, "isphone");
        let model: NbModel = input.injector.get(NbModel);
        //
        expect(input.nativeElement.value).toBe("(__) __-__-__-__", "Should be isphone");
        //
        DOMUtils.inputTextChange(input, "06");
        expect(input.nativeElement.value).toBe("(06) __-__-__-__", "Should be 06");
        //
        DOMUtils.inputTextChange(input, "06a");
        expect(input.nativeElement.value).toBe("(06) __-__-__-__", "Should be 06 without a");
    }));
});
