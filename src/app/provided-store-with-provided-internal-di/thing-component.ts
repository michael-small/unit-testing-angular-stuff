import { rxMutation } from '@angular-architects/ngrx-toolkit';
import { Component, inject, Injectable, Service, signal } from '@angular/core';
import { signalStore, withMethods, withProps } from '@ngrx/signals';
import { delay, of, switchMap } from 'rxjs';

Injectable();
export class StuffService {
  public stuff = of(null);
}

export const Store = signalStore(
  withProps(() => {
    return {
      _thing: inject(StuffService),
    };
  }),
  withMethods((store) => {
    return {
      doThing: rxMutation({
        operation: (params: { stuff: string }) => {
          return store._thing.stuff.pipe(
            delay(500),
            switchMap(() => of('success')),
          );
        },
      }),
    };
  }),
);

@Component({
  selector: 'app-thing',
  providers: [Store, StuffService],
  template: `
    @if (isWorking()) {
      <p>It worked</p>
    }
    <button (click)="doThing()">Do Thing</button>
  `,
})
export class Thing {
  readonly #store = inject(Store);

  protected isWorking = signal(false);

  protected async doThing() {
    const result = await this.#store.doThing({ stuff: 'hi' });
    if (result.status === 'success') {
      this.isWorking.set(true);
    }
  }
}
