import { Component, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightDirective } from './highlight.directive';

@Component({
  template: `
    <h5 class="title" highlight>Hay un valor</h5>
    <h5 highlight="yellow">yellow</h5>
    <p highlight="blue">parrafo</p>
    <p>otro parrafo</p>

    <input [(ngModel)]="color" [highlight]="color">
  `
})
class HostComponent {
  color = 'pink';
}

describe('HighlightDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostComponent, HighlightDirective ],
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

  it('should have three highlight elements', () => {
    const elements = fixture.debugElement.queryAll(By.directive(HighlightDirective));
    const elementsWithout = fixture.debugElement.queryAll(By.css('*:not([highlight])'));
    expect(elements.length).toBe(4);
    expect(elementsWithout.length).toBe(2);
  });

  it('should the elements be match with bgColor', () => {
    const elements = fixture.debugElement.queryAll(By.directive(HighlightDirective));
    expect(elements[0].nativeElement.style.backgroundColor).toBe('pink');
    expect(elements[1].nativeElement.style.backgroundColor).toBe('yellow');
    expect(elements[2].nativeElement.style.backgroundColor).toBe('blue');
    expect(elements.length).toBe(4);
  });

  it('should the elements be match with bgColor', () => {
    const elements = fixture.debugElement.queryAll(By.directive(HighlightDirective));
    expect(elements[0].nativeElement.style.backgroundColor).toBe('pink');
    expect(elements[1].nativeElement.style.backgroundColor).toBe('yellow');
    expect(elements[2].nativeElement.style.backgroundColor).toBe('blue');
    expect(elements.length).toBe(4);
  });

  it('should the h5.title be defaultColor', () => {
    const titleDebug = fixture.debugElement.query(By.css('h5.title'));
    const dir = titleDebug.injector.get(HighlightDirective);
    expect(titleDebug.nativeElement.style.backgroundColor).toBe(dir.defaultColor);
  })

  it('should bind <input> and change the bgColor', () => {
    // Arrange
    const inputDebug: DebugElement = fixture.debugElement.query(By.css('input'));
    const inputElement: HTMLInputElement = inputDebug.nativeElement;

    expect(inputElement.style.backgroundColor).toEqual('pink');
    // Act
    inputElement.value = 'red';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    // Assert
    expect(inputElement.style.backgroundColor).toEqual('red');
    expect(component.color).toEqual('red');
  });
});
