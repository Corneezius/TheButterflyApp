import { MongoObservable } from 'meteor-rxjs';
import { Idea } from '../models';

export const Ideas = new MongoObservable.Collection<Idea>('ideas');
