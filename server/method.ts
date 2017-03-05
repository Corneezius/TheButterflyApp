import { Meteor } from 'meteor/meteor';
import { Ideas, Messages } from '../imports/collections';
import { MessageType } from '../imports/models';

Meteor.methods({
  addMessage(type: MessageType, ideaId: string, content: string) {
    const ideaExists = !!Ideas.collection.find(ideaId).count();

    if (!ideaExists) {
      throw new Meteor.Error('chat-not-exists',
        'Chat doesn\'t exist');
    }

    return {
      messageId: Messages.collection.insert({
        ideaId: ideaId,
        content: content,
        createdAt: new Date(),
        type: type
      })
    };
  }
});
