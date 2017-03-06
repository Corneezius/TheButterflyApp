import { Component, OnInit } from '@angular/core';
import { AlertController, ViewController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { _ } from 'meteor/underscore';
import { Observable, Subscription } from 'rxjs';
import { Ideas, Users } from '../../../../imports/collections';
import { User } from '../../../../imports/models';
import template from './new-idea.html';

@Component({
  template
})
export class NewIdeaComponent implements OnInit {
  senderId: string;
  users: Observable<User[]>;
  usersSubscription: Subscription;

  constructor(
    private alertCtrl: AlertController,
    private viewCtrl: ViewController
  ) {
    this.senderId = Meteor.userId();
  }

  ngOnInit() {
    this.loadUsers();
  }

  addIdea(user): void {
    MeteorObservable.call('addIdea', user._id).subscribe({
      next: () => {
        this.viewCtrl.dismiss();
      },
      error: (e: Error) => {
        this.viewCtrl.dismiss().then(() => {
          this.handleError(e);
        });
      }
    });
  }

  loadUsers(): void {
    this.users = this.findUsers();
  }

  findUsers(): Observable<User[]> {
    // Find all belonging ideas
    return Ideas.find({
      memberIds: this.senderId
    }, {
      fields: {
        memberIds: 1
      }
    })
    // Invoke merge-map with an empty array in case no chat found
    .startWith([])
    .mergeMap((MSVideoPayload) => {
      // Get all userIDs who we're chatting with
      const receiverIds = _.chain(ideas)
        .pluck('memberIds')
        .flatten()
        .concat(this.senderId)
        .value();

      // Find all users which are not in belonging ideas
      return Users.find({
        _id: { $nin: receiverIds }
      })
      // Invoke map with an empty array in case no user found
      .startWith([]);
    });
  }

  handleError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      buttons: ['OK'],
      message: e.message,
      title: 'Oops!'
    });

    alert.present();
  }
}
