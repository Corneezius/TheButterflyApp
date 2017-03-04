import { Component, OnInit } from '@angular/core';
import * as Moment from 'moment';
import { Observable } from 'rxjs';
import { Ideas, Messages } from '../../../../imports/collections';
import { Idea, MessageType } from '../../../../imports/models';
import template from './ideas.html';

@Component({
  template
})
export class IdeasPage implements OnInit {
  ideas;

  constructor() {
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

  removeIdea(idea: Idea): void {
    Ideas.remove({_id: idea._id}).subscribe(() => {});
  }
}
