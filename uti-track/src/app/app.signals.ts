import {signal, WritableSignal} from "@angular/core";

/** Stores the current viewport aspect (true = handset; false = desktop)*/
export const isHandset: WritableSignal<boolean> = signal(false);
