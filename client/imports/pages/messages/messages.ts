import { Component, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { _ } from 'meteor/underscore';
import * as Moment from 'moment';
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
 messagesDayGroups;
 messages: Observable<Message[]>;
 message: string = '';
 autoScroller: MutationObserver;
 scrollOffset = 0;
 senderId: string;


 constructor(
   navParams: NavParams,
   private el: ElementRef
 ) {
    this.selectedIdea = <Idea>navParams.get('idea');

    this.title = this.selectedIdea.title;
    this.picture = this.selectedIdea.picture;
    this.senderId = Meteor.userId();

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
    this.subscribeMessages();

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

  subscribeMessages() {
  this.scrollOffset = this.scroller.scrollHeight;
  this.messagesDayGroups = this.findMessagesDayGroups();
}

findMessagesDayGroups() {
  let isEven = false;

  return Messages.find({
    ideaId: this.selectedIdea._id
  }, {
    sort: { createdAt: 1 }
  })
    .map((messages: Message[]) => {
      const format = 'D MMMM Y';

      // Compose missing data that we would like to show in the view
      messages.forEach((message) => {
       message.ownership = this.senderId == message.senderId ? 'mine' : 'other';
        isEven = !isEven;

        return message;
      });

      // Group by creation day
      const groupedMessages = _.groupBy(messages, (message) => {
        return Moment(message.createdAt).format(format);
      });

      // Transform dictionary into an array since Angular's view engine doesn't know how
      // to iterate through it
      return Object.keys(groupedMessages).map((timestamp: string) => {
        return {
          timestamp: timestamp,
          messages: groupedMessages[timestamp],
          today: Moment().format(format) === timestamp
        };
      });
    });
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
