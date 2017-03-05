import { Component } from '@angular/core';
// import ionic components
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Meteor } from 'meteor/meteor';
import { IdeasPage } from '../pages/ideas/ideas';
import { LoginPage } from '../pages/login/login';
import template from "./app.html";

@Component({
  selector: 'my-app',
  template
})
export class MyApp {
     rootPage: any;

  constructor(platform: Platform) {
    this.rootPage = Meteor.user() ? IdeasPage : LoginPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Check to see if its running on mobile
      if (platform.is('cordova')) {
        StatusBar.styleDefault();
        Splashscreen.hide();
      }
    });
  }
}
