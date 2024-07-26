import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvoComponent } from './evo.component';

describe('EvoComponent', () => {
  let component: EvoComponent;
  let fixture: ComponentFixture<EvoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
