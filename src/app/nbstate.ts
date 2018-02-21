import { NbMetadata } from "./metadata";
import { NbModel } from "./nbmodel";

export interface NBModelStateListener {
    stateKeys(): string[] | string;
    stateChanged(key: string, value: any, model: NbModel);
}
export class NBModelState {
    private inner = new Map<string, any>();
    private listeners = new Map<string, NBModelStateListener[]>();
    constructor(private meta: NbMetadata, private model: NbModel) {
        meta.stateListener.forEach(state => {
            this.listen(state);
        });
    }
    private push(key: string, listener: NBModelStateListener) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(listener);
    }
    private remove(key: string, listener: NBModelStateListener) {
        if (this.listeners.has(key)) {
            let listeners = this.listeners.get(key).filter(l => l != listener);
            this.listeners.set(key, listeners);
        }
    }
    listen(listener: NBModelStateListener) {
        let keys = listener.stateKeys();
        if (keys instanceof Array) {
            keys.forEach(key => {
                this.push(key, listener);
            });
        } else {
            this.push(keys, listener);
        }
        return () => {
            this.unlisten(listener);
        }
    }
    unlisten(listener: NBModelStateListener) {
        let keys = listener.stateKeys();
        if (keys instanceof Array) {
            keys.forEach(key => {
                this.remove(key, listener);
            });
        } else {
            this.remove(keys, listener);
        }
    }
    set(key: string, value: any) {
        this.inner.set(key, value);
        if (this.listeners.has(key)) {
            this.listeners.get(key).forEach(l => l.stateChanged(key, value, this.model));
        }
    }
    get(key: string): any {
        return this.inner.get(key);
    }
}