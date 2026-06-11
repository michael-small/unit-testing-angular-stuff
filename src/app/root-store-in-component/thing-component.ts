import { rxMutation } from '@angular-architects/ngrx-toolkit';
import { Component, inject, signal } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { delay, of, switchMap } from 'rxjs';

export const Store = signalStore(
  { providedIn: 'root' },
  withMethods(() => {
    return {
      doThing: rxMutation({
        operation: (params: { stuff: string }) => {
          return of(null).pipe(
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
