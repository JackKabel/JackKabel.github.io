import {Component, OnDestroy, OnInit} from '@angular/core';
import {FlexboxService, FlexContainerState, FlexItem} from "../flexbox-builder.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-flexbox-builder',
  templateUrl: './flexbox-builder.component.html',
  styleUrl: './flexbox-builder.component.scss'
})
export class FlexboxBuilderComponent implements OnInit, OnDestroy{
  containerState: FlexContainerState = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    rowGap: '1rem',
    columnGap: '1rem',
    containerWidth: '100%',
  };
  items: FlexItem[] = [];

  rowGapValue: number = 0;
  rowGapUnit: string = 'px';
  columnGapValue: number = 0;
  columnGapUnit: string = 'px';

  containerWidth: number | string = '100%';

  private subscriptions: Subscription[] = [];

  constructor(public flexboxService: FlexboxService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.flexboxService.containerState$.subscribe(state => {
        this.containerState = state;

        // Parse gap values
        const rowGap = state.rowGap.match(/^(\d+)(\w+|\%)$/);
        if (rowGap) {
          this.rowGapValue = parseInt(rowGap[1]);
          this.rowGapUnit = rowGap[2];
        }

        const columnGap = state.columnGap.match(/^(\d+)(\w+|\%)$/);
        if (columnGap) {
          this.columnGapValue = parseInt(columnGap[1]);
          this.columnGapUnit = columnGap[2];
        }

        this.containerWidth = state.containerWidth;
      })
    );

    this.subscriptions.push(
      this.flexboxService.items$.subscribe(items => {
        this.items = items;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onPropertyChange(property: keyof FlexContainerState, value: any): void {
    this.flexboxService.updateContainerProperty(property, value);
  }

  onRowGapChange() {
    this.flexboxService.updateContainerProperty('rowGap', `${this.rowGapValue}${this.rowGapUnit}`);
  }

  onColumnGapChange() {
    this.flexboxService.updateContainerProperty('columnGap', `${this.columnGapValue}${this.columnGapUnit}`);
  }

  onContainerWidthChange(value: any) {
    this.containerWidth = value;
    this.flexboxService.updateContainerProperty('containerWidth', value);
  }

  addItem() {
    this.flexboxService.addItem();
  }

  removeItem() {
    this.flexboxService.removeItem();
  }

  getAxisDirection(): { main: string, cross: string } {
    switch (this.containerState.flexDirection) {
      case 'row':
        return { main: '→', cross: '↓' };
      case 'row-reverse':
        return { main: '←', cross: '↓' };
      case 'column':
        return { main: '↓', cross: '→' };
      case 'column-reverse':
        return { main: '↑', cross: '→' };
      default:
        return { main: '→', cross: '↓' };
    }
  }

  setPresetWidth(width: string | number) {
    this.onContainerWidthChange(width);
  }
}
