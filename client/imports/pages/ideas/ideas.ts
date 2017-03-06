import { Component, OnInit } from '@angular/core';
import * as Moment from 'moment';
import { Observable, Subscriber } from 'rxjs';
import { NavController, PopoverController, ModalController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Ideas, Messages, Users } from '../../../../imports/collections';
import { Idea, MessageType, Message } from '../../../../imports/models';
import { IdeasOptionsComponent } from './ideas-options';
import { MessagesPage } from '../messages/messages';
import template from './ideas.html';
import { NewIdeaComponent } from './new-idea';

@Component({
  template
})
export class IdeasPage implements OnInit {
  ideas;
  senderId: string;

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController) {
    this.senderId = Meteor.userId();
  }

  ngOnInit() {
  this.ideas = this.findIdeas();
}

addIdea(): void {
  const modal = this.modalCtrl.create(NewIdeaComponent);
  modal.present();
}

findIdeas(): Observable<Idea[]> {
  // Find ideas and transform them
  return Ideas.find().map(ideas => {
    ideas.forEach(idea => {
      idea.title = '';
      idea.picture = '';

      const receiverId = idea.memberIds.find(memberId => memberId !== this.senderId);
      const receiver = Users.findOne(receiverId);

      if (receiver) {
        idea.title = receiver.profile.name;
        idea.picture = receiver.profile.picture;
      }

      // This will make the last message reactive
      this.findLastIdeaMessage(idea._id).subscribe((message) => {
        idea.lastMessage = message;
      });
    });

    return ideas;
  });
}

findLastIdeaMessage(ideaId: string): Observable<Message> {
  return Observable.create((observer: Subscriber<Message>) => {
    const ideaExists = () => !!Ideas.findOne(ideaId);

    // Re-compute until idea is removed
    MeteorObservable.autorun().takeWhile(ideaExists).subscribe(() => {
      Messages.find({ ideaId }, {
        sort: { createdAt: -1 }
      }).subscribe({
        next: (messages) => {
          // Invoke subscription with the last message found
          if (!messages.length) {
            return;
          }

          const lastMessage = messages[0];
          observer.next(lastMessage);
        },
        error: (e) => {
          observer.error(e);
        },
        complete: () => {
          observer.complete();
        }
      });
    });
  });
}

showOptions(): void {
  const popover = this.popoverCtrl.create(IdeasOptionsComponent, {}, {
    cssClass: 'options-popover ideas-options-popover'
  });


  popover.present();
}


showMessages(idea): void {
  this.navCtrl.push(MessagesPage, {idea});
}

  removeIdea(idea: Idea): void {
    Ideas.remove({_id: idea._id}).subscribe(() => {});
  }
}
