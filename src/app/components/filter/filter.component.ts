import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent {

  @Input() states: FormControl;
  @Input() statesList: string[];
  @Input() years: FormControl;
  @Input() yearList: string[];
  @Output() onFilter = new EventEmitter();

}
