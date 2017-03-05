import 'zone.js';
import 'reflect-metadata';
import { MeteorObservable } from 'meteor-rxjs';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Meteor } from 'meteor/meteor';
import { AppModule } from './imports/app/app.module';

Meteor.startup(() => {
  const subscription = MeteorObservable.autorun().subscribe(() => {
    if (Meteor.loggingIn()) {
      return;
    }

    setTimeout(() => subscription.unsubscribe());
    platformBrowserDynamic().bootstrapModule(AppModule);
  });
});
