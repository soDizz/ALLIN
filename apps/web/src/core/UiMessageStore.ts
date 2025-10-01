import type { UIMessage } from 'ai';
import { BehaviorSubject } from 'rxjs';

export class UIMessageStore<UI_MESSAGE extends UIMessage> {
  private messages = new BehaviorSubject<UI_MESSAGE[]>([]);

  constructor() {}

  public getMessages() {
    return this.messages.getValue();
  }

  public setMessages(
    messages: UI_MESSAGE[] | ((prev: UI_MESSAGE[]) => UI_MESSAGE[]),
  ) {
    this.messages.next(
      typeof messages === 'function'
        ? messages(this.messages.getValue())
        : messages,
    );
  }

  public getMessages$() {
    return this.messages.asObservable();
  }
}
