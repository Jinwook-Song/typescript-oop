import {
  EnableDragging,
  EnableDrop,
  EnableHover,
} from '../../decorators/draggable.js';
import { Draggable, Droppable, Hoverable } from '../common/type.js';
import { BaseComponent, Component } from '../component.js';

export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;
type DragState = 'start' | 'stop' | 'enter' | 'leave';
type OnDragStateListener<T extends Component> = (
  target: T,
  state: DragState,
) => void;
type MuteDnD = 'mute' | 'unmute';

interface SectionContainer extends Component, Composable, Draggable, Hoverable {
  setOnCloseListener(listener: OnCloseListener): void;
  setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
  muteDnDChildren(state: MuteDnD): void;
  getBoundingRect(): DOMRect;
  onDropped(): void;
}

type SecionContainerConstructor = {
  new (): SectionContainer;
};

@EnableDragging
@EnableHover
export class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements SectionContainer
{
  private closeListener?: OnCloseListener;
  private dragStateListener?: OnDragStateListener<PageItemComponent>;

  constructor() {
    super(`<li draggable="true" class="page-item">
            <section class="page-item__body"></section>
            <div class="page-item__controls">
              <button class="close">&times;</button>
            </div>
          </li>`);
    const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };
  }

  onDragStart(_: DragEvent) {
    this.notifyDragObservers('start');
    this.element.classList.add('lifted');
  }
  onDragEnd(_: DragEvent) {
    this.notifyDragObservers('stop');
    this.element.classList.remove('lifted');
  }
  onDragEnter(_: DragEvent) {
    this.notifyDragObservers('enter');
    this.element.classList.add('drop-area');
  }
  onDragLeave(_: DragEvent) {
    this.notifyDragObservers('leave');
    this.element.classList.remove('drop-area');
  }

  onDropped() {
    this.element.classList.remove('drop-area');
  }

  notifyDragObservers(state: DragState) {
    this.dragStateListener && this.dragStateListener(this, state);
  }

  addChild(child: Component) {
    const container = this.element.querySelector(
      '.page-item__body',
    )! as HTMLElement;
    child.attachTo(container);
  }
  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }
  setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
    this.dragStateListener = listener;
  }

  muteDnDChildren(state: MuteDnD): void {
    if (state === 'mute') {
      this.element.classList.add('mute-children');
    } else {
      this.element.classList.remove('mute-children');
    }
  }

  getBoundingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }
}

@EnableDrop
export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable, Composable, Droppable
{
  private children = new Set<SectionContainer>();
  private dragTarget?: SectionContainer;
  private dropTarget?: SectionContainer;

  // DI. SectionContainer를 구현하는 어떤 종류의 Container를 생성할 수 있도록
  constructor(private pageItemConstructor: SecionContainerConstructor) {
    super('<ul class="page"></ul>');
  }

  onDragOver(_: DragEvent): void {}

  onDrop(event: DragEvent) {
    if (!this.dropTarget) return;
    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
      const dragY = this.dragTarget.getBoundingRect().y;
      const dropY = event.clientY;

      this.dragTarget.removeFrom(this.element);
      this.dropTarget.attach(
        this.dragTarget,
        dropY < dragY ? 'beforebegin' : 'afterend',
      );
    }
    this.dropTarget.onDropped();
  }

  addChild(section: Component) {
    const item = new this.pageItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend');
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
      this.children.delete(item);
    });
    this.children.add(item);
    item.setOnDragStateListener((target, state) => {
      switch (state) {
        case 'start':
          this.dragTarget = target;
          this.updateSections('mute');
          break;
        case 'stop':
          this.dragTarget = undefined;
          this.updateSections('unmute');
          break;
        case 'enter':
          this.dropTarget = target;
          break;
        case 'leave':
          this.dropTarget = undefined;
          break;
        default:
          throw new Error('Unsupported drag state');
      }
    });
  }

  private updateSections(state: MuteDnD) {
    this.children.forEach((section) => section.muteDnDChildren(state));
  }
}
