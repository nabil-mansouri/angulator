import { NBModelStateListener } from "../nbstate";
import { STATE_NAME, NbModel } from "../nbmodel";

export class NBModelStateListenerAttrName implements NBModelStateListener {

    stateKeys(): string[] | string {
        return STATE_NAME;
    }
    stateChanged(key: string, value: any, model: NbModel) {
         
    }
}