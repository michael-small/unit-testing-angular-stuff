import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, Thing } from './thing-component';
import { signalStore, withMethods } from '@ngrx/signals';
import { rxMutation } from '@angular-architects/ngrx-toolkit';
import { of } from 'rxjs';

const StoreStub = signalStore(
  { providedIn: 'root' },
  withMethods(() => {
    return {
      doThing: rxMutation({
        operation: (params: { stuff: string }) => {
          return of('success');
        },
      }),
    };
  }),
);

describe('Thing component (provided store with internal DI)', async () => {
  let component: Thing;
  let fixture: ComponentFixture<Thing>;

  beforeEach(async () => {
    // https://angular.dev/guide/testing/components-scenarios#override-component-providers
    TestBed.configureTestingModule({}).overrideComponent(Thing, {
      set: {
        providers: [{ provide: Store, useClass: StoreStub }],
      },
    });
    fixture = TestBed.createComponent(Thing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });
  it('can mutate state after clicking a button', async () => {
    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('p').textContent.trim()).toBe('It worked');
  });
});
