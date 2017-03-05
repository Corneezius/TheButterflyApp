import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';
import { Messages } from '../../../../imports/collections';
import { Idea, Message, MessageType } from '../../../../imports/models';
import template from './messages.html';

@Component({
  template
})
export class MessagesPage implements OnInit {
  selectedIdea: Idea;
  title: string;
 picture: string;
 messages: Observable<Message[]>;
 message: string = '';

  constructor(navParams: NavParams) {
    this.selectedIdea = <Idea>navParams.get('idea');

    this.title = this.selectedIdea.title;
    this.picture = this.selectedIdea.picture;

    console.log('Selected idea is: ', this.selectedIdea);
  }

  ngOnInit() {
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
