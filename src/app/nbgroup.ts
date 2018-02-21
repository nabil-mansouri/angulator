import {
    OnChanges, ElementRef, Renderer, AfterContentInit, SimpleChanges,
    Input, Output, Directive, OnInit, OnDestroy, EventEmitter, InjectionToken, Optional, DoCheck, Self, Inject, Host, IterableDiffers, IterableDiffer, KeyValueDiffers, KeyValueDiffer, forwardRef, SkipSelf
} from "@angular/core";
import { StringUtils } from "./utils";

export const NB_MODELGROUP_TOKEN = new InjectionToken('NB_MODELGROUP_TOKEN');
export interface NBGroupMember {
    memberName: string;
    onGroupReady();
}
@Directive({
    selector: '[nbGroup]',
    exportAs: 'nbGroup',
    providers: [{ provide: NB_MODELGROUP_TOKEN, useExisting: forwardRef(() => NbGroup), multi: false }]
})
export class NbGroup implements OnInit, AfterContentInit {
    _nbGroup: any;
    name = StringUtils.randomNum(10);
    children = new Map<string, NBGroupMember>();
    @Input() set nbGroup(n: string) { this._nbGroup = n; }
    constructor( @Optional() @SkipSelf() private parent: NbGroup) { }
    get nbGroup() { return this._nbGroup; }
    ngOnInit() { }
    childName(model: NBGroupMember) {
        return this.childNameStr(model.memberName);
    }
    childNameStr(str: string) {
        return this.name + "_" + str;
    }
    registerChild(model: NBGroupMember): string {
        let name = this.childName(model);
        this.children.set(name, model);
        return name;
    }
    unregisterChild(model: NBGroupMember) {
        this.children.delete(this.childName(model));
    }
    find(name): NBGroupMember {
        let fullname = this.childNameStr(name);
        if (this.children.has(fullname)) {
            return this.children.get(fullname);
        } else {
            return null;
        }
    }
    findInTree(name): NBGroupMember {
        let founded = this.find(name);
        if (founded) {
            return founded;
        } else if (this.parent) {
            return this.parent.findInTree(name);
        } else {
            return null;
        }
    }
    ngAfterContentInit() {
        this.children.forEach(child => child.onGroupReady());
    }
}
