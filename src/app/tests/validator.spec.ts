import { ComponentFixture, TestBed, async, tick, fakeAsync } from '@angular/core/testing';
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
import { User, TestComponent, TestComponentFactory } from "./_test";



describe('Testing validators', () => {

    let fixture: ComponentFixture<TestComponent>;
    let comp: TestComponent;
    beforeEach(async(() => {
        TestComponentFactory.create();
    }));

    beforeEach(fakeAsync(() => {
        fixture = <any>TestBed.createComponent(TestComponentFactory.type);
        fixture.detectChanges();
        comp = fixture.componentInstance;
        tick();
    }));
    it('should validate name from model', fakeAsync(() => {
        let input = fixture.debugElement.query(By.directive(NbModel));
        let model: NbModel = input.injector.get(NbModel);
        //len < min
        comp.user.name = "MODE";
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBe(true);
        //length=min
        comp.user.name = "MODEL";
        fixture.detectChanges();
        tick();
        expect(model.valid).toBe(true);
        //len > max
        comp.user.name = "MODEL+MODEL";
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBe(true);
    }));

    it('should validate name from view', fakeAsync(() => {
        let input = fixture.debugElement.query(By.css(".name"));
        let model: NbModel = input.injector.get(NbModel);
        //len < min
        DOMUtils.inputTextChange(input, "VIEW");
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBe(true, "Should be invalid (<min)");
        //length=min
        DOMUtils.inputTextChange(input, "VIEWS");
        fixture.detectChanges();
        tick();
        expect(model.valid).toBe(true, "Should be valid (=min)");
        //len > max
        DOMUtils.inputTextChange(input, "VIEWS+VIEWS");
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBe(true, "Should be invalid (>max)");
    }));
    it('should update validation when dependency view change', fakeAsync(() => {
        let inputCheck = fixture.debugElement.query(By.css(".hasBrother"));
        let inputText = fixture.debugElement.query(By.css(".brother"));
        let model: NbModel = inputText.injector.get(NbModel);
        expect(model.valid).toBeTruthy("Should be valid");
        //CHECK IT
        DOMUtils.inputCheckChange(inputCheck, true);
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid");
        //UNCHECK IT 
        DOMUtils.inputCheckChange(inputCheck, false);
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid anew");
    }));
    it('should update validation when dependency model change', fakeAsync(() => {
        let inputCheck = fixture.debugElement.query(By.css(".hasBrother"));
        let inputText = fixture.debugElement.query(By.css(".brother"));
        let model: NbModel = inputText.injector.get(NbModel);
        expect(model.valid).toBeTruthy("Should be valid");
        //CHECK IT
        comp.user.hasBrother = true;
        fixture.detectChanges();
        tick();
        expect(model.invalid).toBeTruthy("Should be invalid");
        //UNCHECK IT 
        comp.user.hasBrother = false;
        fixture.detectChanges();
        tick();
        expect(model.valid).toBeTruthy("Should be valid anew");
    }));
    //TODO should manage async validators
    //TODO should manage error renderer (hide,enable...)
    //TODO should manage list of form field (scope)
    //TODO add all validators
    //TODO should manage form.valid status
});
