import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import * as Moment from 'moment';
import { Ideas, Messages } from '../imports/collections';
import { MessageType } from '../imports/models';

Meteor.startup(() => {
  if (Meteor.settings) {
   Object.assign(Accounts._options, Meteor.settings['accounts-phone']);
   SMS.twilio = Meteor.settings['twilio'];
 }
 
  if (Ideas.find({}).cursor.count() === 0) {
    let ideaId;

    ideaId = Ideas.collection.insert({
      title: 'Push a button and a gorilla comes',
      picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg'
    });

    Messages.collection.insert({
      ideaId: ideaId,
      content: 'You on your way?',
      createdAt: Moment().subtract(1, 'hours').toDate(),
      type: MessageType.TEXT
    });

    ideaId = Ideas.collection.insert({
      title: 'An anthology about faith authored by a million people',
      picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg'
    });

    Messages.collection.insert({
      ideaId: ideaId,
      content: 'Hey, it\'s me',
      createdAt: Moment().subtract(2, 'hours').toDate(),
      type: MessageType.TEXT
    });

    ideaId = Ideas.collection.insert({
      title: 'Send insults to your friends',
      picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg'
    });

    Messages.collection.insert({
      ideaId: ideaId,
      content: 'I should buy a boat',
      createdAt: Moment().subtract(1, 'days').toDate(),
      type: MessageType.TEXT
    });

    ideaId = Ideas.collection.insert({
      title: 'Car sharing for black people: black rides matter',
      picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg'
    });

    Messages.collection.insert({
      ideaId: ideaId,
      content: 'Look at my mukluks!',
      createdAt: Moment().subtract(4, 'days').toDate(),
      type: MessageType.TEXT
    });

    ideaId = Ideas.collection.insert({
      title: 'Marketplace for renting babies',
      picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg'
    });

    Messages.collection.insert({
      ideaId: ideaId,
      content: 'This is wicked good ice cream.',
      createdAt: Moment().subtract(2, 'weeks').toDate(),
      type: MessageType.TEXT
    });
  }
});
