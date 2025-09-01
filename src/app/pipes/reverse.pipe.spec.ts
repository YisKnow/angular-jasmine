import { Component, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
  it('create an instance', () => {
    const pipe = new ReversePipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform "roma" to "amor"', () => {
    // Arrange
    const pipe = new ReversePipe();
    const rta = pipe.transform('roma');
    // Act
    // Assert
    expect(rta).toEqual('amor');
  });

  it('should transform "123" to "321"', () => {
    // Arrange
    const pipe = new ReversePipe();
    const rta = pipe.transform('123');
    // Act
    // Assert
    expect(rta).toEqual('321');
  });
});

@Component({
  template: `
    <h5>{{ 'amor' | reverse }}</h5>
    <input [(ngModel)]="text">
    <p>{{ text | reverse }}</p>

  `
})
class HostComponent {
  text = '';
}

describe('ReversePipe from HostComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostComponent, ReversePipe ],
      imports: [ FormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the h5 be "roma"', () => {
    // Arrange
    const h5Debug: DebugElement = fixture.debugElement.query(By.css('h5'));
    const h5Text: string = h5Debug.nativeElement.textContent;
    // Act
    // Assert
    expect(h5Text).toBe('roma');
  });

  it('should apply reverse pipe when typing in the input', () => {
    // Arrange
    const inputDebug: DebugElement = fixture.debugElement.query(By.css('input'));
    const inputElement: HTMLInputElement = inputDebug.nativeElement;
    const pDebug: DebugElement = fixture.debugElement.query(By.css('p'));
    // Act
    expect(pDebug.nativeElement.textContent).toBe('');
    inputElement.value = 'ANA 2';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    // Assert
    expect(pDebug.nativeElement.textContent).toBe('2 ANA');
  });
});
