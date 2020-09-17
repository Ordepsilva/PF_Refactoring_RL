import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MendeleyComponentComponent } from './mendeley-component.component';

describe('MendeleyComponentComponent', () => {
  let component: MendeleyComponentComponent;
  let fixture: ComponentFixture<MendeleyComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MendeleyComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MendeleyComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
