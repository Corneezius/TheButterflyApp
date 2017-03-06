import { Meteor } from 'meteor/meteor';
import { Ideas, Messages } from '../imports/collections';
import { MessageType, Profile } from '../imports/models';
import { check, Match } from 'meteor/check';

const nonEmptyString = Match.Where((str) => {
  check(str, String);
  return str.length > 0;
});

Meteor.methods({
  addIdea(receiverId: string): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized',
        'User must be logged-in to create a new chat');
    }

    check(receiverId, nonEmptyString);

    if (receiverId === this.userId) {
      throw new Meteor.Error('illegal-receiver',
        'Receiver must be different than the current logged in user');
    }

    const ideaExists = !!Ideas.collection.find({
      memberIds: { $all: [this.userId, receiverId] }
    }).count();

    if (ideaExists) {
      throw new Meteor.Error('idea-exists',
        'Idea already exists');
    }

    const idea = {
      memberIds: [this.userId, receiverId]
    };

    Ideas.insert(idea);
  },


  updateProfile(profile: Profile): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');

    check(profile, {
      name: nonEmptyString
    });

    Meteor.users.update(this.userId, {
      $set: {profile}
    });
  },

  addMessage(type: MessageType, ideaId: string, content: string) {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');

    check(type, Match.OneOf(String, [ MessageType.TEXT ]));
    check(ideaId, nonEmptyString);
    check(content, nonEmptyString);

    const ideaExists = !!Ideas.collection.find(ideaId).count();

    if (!ideaExists) {
      throw new Meteor.Error('chat-not-exists',
        'Chat doesn\'t exist');
    }

    return {
      messageId: Messages.collection.insert({
        ideaId: ideaId,
        senderId: this.userId,
        content: content,
        createdAt: new Date(),
        type: type
      })
    };
  }
});
