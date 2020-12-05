import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchListCardComponent } from './watchListCard.component';

describe('WatchListCardComponent', () => {
  let component: WatchListCardComponent;
  let fixture: ComponentFixture<WatchListCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WatchListCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
