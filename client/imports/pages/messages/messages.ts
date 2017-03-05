import { Component, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';
import { Messages } from '../../../../imports/collections';
import { Idea, Message, MessageType } from '../../../../imports/models';
import template from './messages.html';

@Component({
  template
})
export class MessagesPage implements OnInit, OnDestroy {
  selectedIdea: Idea;
  title: string;
 picture: string;
 messages: Observable<Message[]>;
 message: string = '';
 autoScroller: MutationObserver;
 scrollOffset = 0;


 constructor(
   navParams: NavParams,
   private el: ElementRef
 ) {
    this.selectedIdea = <Idea>navParams.get('idea');

    this.title = this.selectedIdea.title;
    this.picture = this.selectedIdea.picture;

    console.log('Selected idea is: ', this.selectedIdea);
  }

  private get messagesPageContent(): Element {
   return this.el.nativeElement.querySelector('.messages-page-content');
 }

 private get messagesList(): Element {
   return this.messagesPageContent.querySelector('.messages');
 }

 private get scroller(): Element {
   return this.messagesList.querySelector('.scroll-content');
 }

  ngOnInit() {
    this.autoScroller = this.autoScroll();

    let isEven = false;

    this.messages = Messages.find(
      {ideaId: this.selectedIdea._id},
      {sort: {createdAt: 1}}
    ).map((messages: Message[]) => {
      messages.forEach((message: Message) => {
        message.ownership = isEven ? 'mine' : 'other';
        isEven = !isEven;
      });

      return messages;
    });
  }

  ngOnDestroy() {
    this.autoScroller.disconnect();
  }

  autoScroll(): MutationObserver {
    const autoScroller = new MutationObserver(this.scrollDown.bind(this));

    autoScroller.observe(this.messagesList, {
      childList: true,
      subtree: true
    });

    return autoScroller;
  }

  scrollDown(): void {
    // Scroll down and apply specified offset
    this.scroller.scrollTop = this.scroller.scrollHeight - this.scrollOffset;
    // Zero offset for next invocation
    this.scrollOffset = 0;
  }
 
  onInputKeypress({ keyCode }: KeyboardEvent): void {
    if (keyCode === 13) {
      this.sendTextMessage();
    }
  }

  sendTextMessage(): void {
    // If message was yet to be typed, abort
    if (!this.message) {
      return;
    }

    MeteorObservable.call('addMessage', MessageType.TEXT,
      this.selectedIdea._id,
      this.message
    ).zone().subscribe(() => {
      // Zero the input field
      this.message = '';
    });
  }
}
