import { Component, OnInit } from '@angular/core';
import * as Moment from 'moment';
import { Observable, Subscriber } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';
import { NavController, PopoverController, ModalController } from 'ionic-angular';
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

findIdeas(): Observable<Chat[]> {
  // Find chats and transform them
  return Chats.find().map(chats => {
    chats.forEach(chat => {
      chat.title = '';
      chat.picture = '';

      const receiverId = chat.memberIds.find(memberId => memberId !== this.senderId);
      const receiver = Users.findOne(receiverId);

      if (receiver) {
        chat.title = receiver.profile.name;
        chat.picture = receiver.profile.picture;
      }

      // This will make the last message reactive
      this.findLastChatMessage(chat._id).subscribe((message) => {
        chat.lastMessage = message;
      });
    });

    return chats;
  });
}

findLastChatMessage(chatId: string): Observable<Message> {
  return Observable.create((observer: Subscriber<Message>) => {
    const chatExists = () => !!Chats.findOne(chatId);

    // Re-compute until chat is removed
    MeteorObservable.autorun().takeWhile(chatExists).subscribe(() => {
      Messages.find({ chatId }, {
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


showMessages(idea): void {
  this.navCtrl.push(MessagesPage, {idea});
}

  removeIdea(idea: Idea): void {
    Ideas.remove({_id: idea._id}).subscribe(() => {});
  }
}
