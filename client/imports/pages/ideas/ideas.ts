import { Component, OnInit } from '@angular/core';
import * as Moment from 'moment';
import { Observable } from 'rxjs';
import { NavController, PopoverController, ModalController } from 'ionic-angular';
import { Ideas, Messages } from '../../../../imports/collections';
import { Idea, MessageType } from '../../../../imports/models';
import { IdeasOptionsComponent } from './ideas-options';
import { MessagesPage } from '../messages/messages';
import template from './ideas.html';
import { NewIdeaComponent } from './new-idea';

@Component({
  template
})
export class IdeasPage implements OnInit {
  ideas;

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController) {
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

showOptions(): void {
  const popover = this.popoverCtrl.create(IdeasOptionsComponent, {}, {
    cssClass: 'options-popover chats-options-popover'
  });


  popover.present();
}

addIdea(): void {
  const modal = this.modalCtrl.create(NewIdeaComponent);
  modal.present();
}

showMessages(idea): void {
  this.navCtrl.push(MessagesPage, {idea});
}

  removeIdea(idea: Idea): void {
    Ideas.remove({_id: idea._id}).subscribe(() => {});
  }
}
