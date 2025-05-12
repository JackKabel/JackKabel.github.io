import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FlexContainerState {
  flexDirection: string;
  flexWrap: string;
  justifyContent: string;
  alignItems: string;
  alignContent: string;
  rowGap: string;
  columnGap: string;
  containerWidth: string | number;
}

export interface FlexItem {
  id: number;
  content: string;
  order: number;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
  alignSelf: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlexboxService {
  private _containerState = new BehaviorSubject<FlexContainerState>({
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    rowGap: '0px',
    columnGap: '0px',
    containerWidth: '100%'
  });

  private _items = new BehaviorSubject<FlexItem[]>([
    { id: 1, content: 'Item 1', order: 0, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto' },
    { id: 2, content: 'Item 2', order: 0, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto' },
    { id: 3, content: 'Item 3', order: 0, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto' }
  ]);

  private _history: FlexContainerState[] = [];
  private _historyIndex = -1;

  containerState$ = this._containerState.asObservable();
  items$ = this._items.asObservable();

  constructor() {
    // Save initial state to history
    this.saveToHistory();
  }

  get containerState(): FlexContainerState {
    return this._containerState.getValue();
  }

  get items(): FlexItem[] {
    return this._items.getValue();
  }

  updateContainerProperty(property: keyof FlexContainerState, value: string) {
    const state = { ...this._containerState.getValue() };
    state[property] = value;
    this._containerState.next(state);
    this.saveToHistory();
  }

  addItem() {
    const items = [...this._items.getValue()];
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;

    items.push({
      id: newId,
      content: `Item ${newId}`,
      order: 0,
      flexGrow: 0,
      flexShrink: 1,
      flexBasis: 'auto',
      alignSelf: 'auto'
    });

    this._items.next(items);
    this.saveToHistory();
  }

  removeItem() {
    const items = [...this._items.getValue()];
    if (items.length > 0) {
      items.pop();
      this._items.next(items);
      this.saveToHistory();
    }
  }

  updateItem(updatedItem: FlexItem) {
    const items = this._items.getValue().map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    this._items.next(items);
    this.saveToHistory();
  }

  saveToHistory() {
    // Truncate forward history if we're not at the end
    if (this._historyIndex < this._history.length - 1) {
      this._history = this._history.slice(0, this._historyIndex + 1);
    }

    this._history.push({...this._containerState.getValue()});
    this._historyIndex = this._history.length - 1;
  }

  canUndo(): boolean {
    return this._historyIndex > 0;
  }

  canRedo(): boolean {
    return this._historyIndex < this._history.length - 1;
  }

  undo() {
    if (this.canUndo()) {
      this._historyIndex--;
      this._containerState.next({...this._history[this._historyIndex]});
    }
  }

  redo() {
    if (this.canRedo()) {
      this._historyIndex++;
      this._containerState.next({...this._history[this._historyIndex]});
    }
  }

  reset() {
    this._containerState.next({
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      rowGap: '0px',
      columnGap: '0px',
      containerWidth: '100%'
    });

    this._items.next([
      { id: 1, content: 'Item 1', order: 0, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto' },
      { id: 2, content: 'Item 2', order: 0, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto' },
      { id: 3, content: 'Item 3', order: 0, flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto' }
    ]);

    // Clear history and save new initial state
    this._history = [];
    this._historyIndex = -1;
    this.saveToHistory();
  }

  applyPreset(presetName: string) {
    switch(presetName) {
      case 'centered':
        this._containerState.next({
          flexDirection: 'row',
          flexWrap: 'nowrap',
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
          rowGap: '0px',
          columnGap: '0px',
          containerWidth: '100%'
        });
        break;
      case 'navbar':
        this._containerState.next({
          flexDirection: 'row',
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignContent: 'stretch',
          rowGap: '0px',
          columnGap: '0px',
          containerWidth: '100%'
        });
        break;
      case 'cards':
        this._containerState.next({
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          alignContent: 'stretch',
          rowGap: '20px',
          columnGap: '20px',
          containerWidth: '100%'
        });
        break;
      case 'sidebar':
        this._containerState.next({
          flexDirection: 'row',
          flexWrap: 'nowrap',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          alignContent: 'stretch',
          rowGap: '0px',
          columnGap: '20px',
          containerWidth: '100%'
        });
        break;
    }
    this.saveToHistory();
  }

  generateCssCode(isLonghand: boolean): string {
    const state = this.containerState;

    if (isLonghand) {
      return `.container {
  display: flex;
  flex-direction: ${state.flexDirection};
  flex-wrap: ${state.flexWrap};
  justify-content: ${state.justifyContent};
  align-items: ${state.alignItems};
  align-content: ${state.alignContent};
  row-gap: ${state.rowGap};
  column-gap: ${state.columnGap};
}`;
    } else {
      return `.container {
  display: flex;
  flex-flow: ${state.flexDirection} ${state.flexWrap};
  justify-content: ${state.justifyContent};
  align-items: ${state.alignItems};
  align-content: ${state.alignContent};
  gap: ${state.rowGap} ${state.columnGap};
}`;
    }
  }

  generateHtmlCode(): string {
    const items = this.items;
    return `<div class="container">
${items.map(item => `  <div class="item">${item.content}</div>`).join('\n')}
</div>`;
  }

  generateCompleteCode(isLonghand: boolean): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flexbox Layout</title>
  <style>
${this.generateCssCode(isLonghand)}

  .item {
    padding: 1rem;
    background-color: #4cc9f0;
    color: white;
    border-radius: 4px;
    text-align: center;
    margin: 0;
  }
  </style>
</head>
<body>
${this.generateHtmlCode()}
</body>
</html>`;
  }
}
