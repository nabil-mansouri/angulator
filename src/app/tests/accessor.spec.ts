import { ComponentFixture, TestBed, async, tick, fakeAsync, flushMicrotasks } from '@angular/core/testing';
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



describe('Testing accessors', () => {

    let fixture: ComponentFixture<TestComponent>;
    let comp: TestComponent;
    beforeEach(async(() => {
        TestComponentFactory.create();
        fixture = <any>TestBed.createComponent(TestComponentFactory.type);
        comp = fixture.componentInstance;
        fixture.detectChanges();
    }));
 

    it('should update view from model', fakeAsync(() => {
        comp.user.name = "MODEL";
        fixture.detectChanges();
        tick();
        let input = fixture.debugElement.query(By.css(".name"));
        expect(comp.user.name).toBe("MODEL", "MODEL value not setted");
        expect(input.nativeElement.value).toBe("MODEL", "HTML element not setted");
        //CHANGE GROUP
        console.log("SET UPDATE......")
        comp.user = new User();
        comp.user.name = "UPDATE";
        fixture.detectChanges();
        tick();
        console.log("TICK UPDATE......")
        expect(comp.user.name).toBe("UPDATE");
        expect(input.nativeElement.value).toBe("UPDATE");
    }));

    it('should update model from view', fakeAsync(() => {
        expect(comp.count).toBe(0, "Should count be 0")
        let input = fixture.debugElement.query(By.css(".name"));
        DOMUtils.inputTextChange(input, "VIEW");
        fixture.detectChanges();
        tick();
        expect(comp.user.name).toBe("VIEW");
        expect(input.nativeElement.value).toBe("VIEW");
        expect(comp.count).toBe(1, "Should count be 1")
    }));
    it('should update view select from model', fakeAsync(() => {
        comp.user.happy = "yes";
        fixture.detectChanges();
        tick();
        let input = fixture.debugElement.query(By.css(".happy"));
        let select = fixture.debugElement.query(By.directive(NBSelectControlValueAccessor));
        let options = select.queryAll(By.directive(NbSelectOption));
        expect(options.length).toEqual(2);
        expect(comp.user.happy).toBe("yes");
        expect(input.nativeElement.value).toBe("yes");
        //CHANGE GROUP
        comp.user = new User();
        comp.user.happy = "no";
        fixture.detectChanges();
        tick();
        expect(comp.user.happy).toBe("no");
        expect(input.nativeElement.value).toBe("no");
    }));

    it('should update model from view select', fakeAsync(() => {
        expect(comp.countSelect).toBe(0, "Should count be 0")
        let input = fixture.debugElement.query(By.css(".happy"));
        DOMUtils.selectoptionChange(input, "yes");
        fixture.detectChanges();
        tick();
        expect(comp.user.happy).toBe("yes");
        expect(input.nativeElement.value).toBe("yes");
        expect(comp.countSelect).toBe(1, "Should count be 1")
    }));
    it('should update view select multiple from model', fakeAsync(() => {
        let ref = ["blue", "yellow"];
        comp.user.colors = ["blue", "yellow"];
        fixture.detectChanges();
        tick();
        let input = fixture.debugElement.query(By.css(".colors"));
        let optBlue = fixture.debugElement.query(By.css(".blue"));
        let optGreen = fixture.debugElement.query(By.css(".green"));
        let optYellow = fixture.debugElement.query(By.css(".yellow"));
        let select = fixture.debugElement.query(By.directive(NBSelectMultipleControlValueAccessor));
        let options = select.queryAll(By.directive(NbSelectMultipleOption));
        expect(options.length).toEqual(3);
        expect(comp.user.colors).toEqual(ref);
        expect(optBlue.nativeElement.selected).toBeTruthy("Blue should be selected");
        expect(optGreen.nativeElement.selected).toBeFalsy("Green should be selected");
        expect(optYellow.nativeElement.selected).toBeTruthy("Yellow should be selected");
        //CHANGE GROUP
        comp.user = new User();
        comp.user.colors = ["blue"];
        fixture.detectChanges();
        tick();
        expect(comp.user.colors).toEqual(["blue"]);
        expect(optBlue.nativeElement.selected).toBeTruthy("Blue should be selected");
        expect(optGreen.nativeElement.selected).toBeFalsy("Green should not be selected");
        expect(optYellow.nativeElement.selected).toBeFalsy("Yellow should not be selected");
    }));
    it('should update model from view select multiple', fakeAsync(() => {
        expect(comp.countSelect).toBe(0, "Should count be 0")
        let input = fixture.debugElement.query(By.css(".colors"));
        let optBlue = fixture.debugElement.query(By.css(".blue"));
        let optGreen = fixture.debugElement.query(By.css(".green"));
        let optYellow = fixture.debugElement.query(By.css(".yellow"));
        DOMUtils.selectoptionMultipleChange(input, optBlue);
        DOMUtils.selectoptionMultipleChange(input, optYellow);
        fixture.detectChanges();
        tick();
        expect(comp.user.colors).toEqual(["blue", "yellow"]);
        expect(optBlue.nativeElement.selected).toBeTruthy("Blue should be selected");
        expect(optGreen.nativeElement.selected).toBeFalsy("Green should not be selected");
        expect(optYellow.nativeElement.selected).toBeTruthy("Yellow should not be selected");
        expect(comp.countSelect).toBe(2, "Should count be 1")
    }));
    it('should update view check from model', fakeAsync(() => {
        comp.user.hasBrother = false;
        fixture.detectChanges();
        tick();
        let input = fixture.debugElement.query(By.css(".hasBrother"));
        expect(comp.user.hasBrother).toBeFalsy("Should model be true");
        expect(input.nativeElement.checked).toBeFalsy("Should checked be true");
        //CHANGE GROUP
        comp.user = new User();
        comp.user.hasBrother = true;
        fixture.detectChanges();
        tick();
        expect(comp.user.hasBrother).toBeTruthy("Should model be true");
        expect(input.nativeElement.checked).toBeTruthy("Should checked be true");
    }));

    it('should update model from view check', fakeAsync(() => {
        expect(comp.countCheck).toBe(0, "Should count be 0")
        let input = fixture.debugElement.query(By.css(".hasBrother"));
        DOMUtils.inputCheckChange(input, true);
        fixture.detectChanges();
        tick();
        expect(comp.user.hasBrother).toBeTruthy("Should model be true");
        expect(input.nativeElement.checked).toBeTruthy("Should checked be true");
        expect(comp.countCheck).toBe(1, "Should count be 1")
    }));
    it('should update view radio from model', fakeAsync(() => {
        comp.user.sexe = "girl";
        fixture.detectChanges();
        tick();
        let inputGirl = fixture.debugElement.query(By.css(".girl"));
        let inputBoy = fixture.debugElement.query(By.css(".boy"));
        expect(comp.user.sexe).toBe("girl", "Should model be true");
        expect(inputGirl.nativeElement.checked).toBeTruthy("Should checked girl be true");
        expect(inputBoy.nativeElement.checked).toBeFalsy("Should checked boy be false");
        //CHANGE GROUP
        comp.user = new User();
        comp.user.sexe = "boy";
        fixture.detectChanges();
        tick();
        expect(comp.user.sexe).toBe("boy", "Should model be true");
        expect(inputGirl.nativeElement.checked).toBeFalsy("Should checked girl be false");
        expect(inputBoy.nativeElement.checked).toBeTruthy("Should checked boy be true");
    }));

    it('should update model from view radio', fakeAsync(() => {
        expect(comp.countRadio).toBe(0, "Should count be 0")
        let inputGirl = fixture.debugElement.query(By.css(".girl"));
        let modelGirl: NbModel = inputGirl.injector.get(NbModel);
        let inputBoy = fixture.debugElement.query(By.css(".boy"));
        let modelBoy: NbModel = inputBoy.injector.get(NbModel);
        DOMUtils.inputSelectChange(inputGirl, true);
        fixture.detectChanges();
        tick();
        expect(comp.user.sexe).toBe("girl", "Should be girl");
        expect(inputGirl.nativeElement.checked).toBeTruthy("Should checked girl be true");
        expect(inputBoy.nativeElement.checked).toBeFalsy("Should checked boy be false");
        expect(inputGirl.nativeElement.name).toBe(modelGirl.name, "Should girl name ok");
        expect(inputBoy.nativeElement.name).toBe(modelBoy.name, "Should boy name ok");
        expect(modelGirl.name).toBe(modelBoy.name, "Should boy and girl have same name");
        expect(comp.countRadio).toBe(1, "Should count be 1")
    }));

    it('should update view number from model', fakeAsync(() => {
        comp.user.age = 10;
        fixture.detectChanges();
        tick();
        let input = fixture.debugElement.query(By.css(".age"));
        expect(comp.user.age).toBe(10, "Should model be 10");
        expect(input.nativeElement.value).toEqual("10", "Should view be 10");
        //CHANGE GROUP
        comp.user = new User();
        comp.user.age = 20;
        fixture.detectChanges();
        tick();
        expect(comp.user.age).toBe(20, "Should model be 10");
        expect(input.nativeElement.value).toEqual("20", "Should view be 10");
    }));

    it('should update model from view number', fakeAsync(() => {
        expect(comp.countNum).toBe(0, "Should count be 0")
        let input = fixture.debugElement.query(By.css(".age"));
        DOMUtils.inputTextChange(input, 10);
        fixture.detectChanges();
        tick();
        expect(comp.user.age).toBe(10, "Should model be 10");
        expect(input.nativeElement.value).toEqual("10", "Should view be 10");
        expect(comp.countNum).toBe(1, "Should count be 1")
    }));



    //TODO should manage validation with dependencies
    //TODO should manage async validators
    //TODO should manage error renderer (hide,enable...)
    //TODO should manage list of form field (scope)
    //TODO add all validators
    //TODO should manage form.valid status
});
