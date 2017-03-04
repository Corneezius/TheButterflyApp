import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Messages } from '../../../../imports/collections';
import { Idea, Message } from '../../../../imports/models';
import template from './messages.html';

@Component({
  template
})
export class MessagesPage implements OnInit {
  selectedIdea: Idea;

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
}
