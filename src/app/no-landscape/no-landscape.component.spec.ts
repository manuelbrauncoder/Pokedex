import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoLandscapeComponent } from './no-landscape.component';

describe('NoLandscapeComponent', () => {
  let component: NoLandscapeComponent;
  let fixture: ComponentFixture<NoLandscapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoLandscapeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoLandscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
