import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as Moment from 'moment';
import { Observable } from 'rxjs';
import { Ideas, Messages } from '../../../../imports/collections';
import { Idea, MessageType } from '../../../../imports/models';
import { MessagesPage } from '../messages/messages';
import template from './ideas.html';

@Component({
  template
})
export class IdeasPage implements OnInit {
  ideas;

  constructor(private navCtrl: NavController) {
  }

  ngOnInit() {
  this.ideas = Ideas
    .find({})
    .mergeMap((ideas: Idea[]) =>
      Observable.combineLatest(
        ...ideas.map((idea: Idea) =>
          Messages
            .find({ideaId: idea._id})
            .startWith(null)
            .map(messages => {
              if (messages) idea.lastMessage = messages[0];
              return idea;
            })
        )
      )
    ).zone();
}

showMessages(idea): void {
  this.navCtrl.push(MessagesPage, {idea});
}

  removeIdea(idea: Idea): void {
    Ideas.remove({_id: idea._id}).subscribe(() => {});
  }
}
