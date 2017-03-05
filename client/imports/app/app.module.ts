import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MomentModule } from 'angular2-moment';
import { MessagesPage } from '../pages/messages/messages';
import { IdeasPage } from '../pages/ideas/ideas'
import { PhoneService } from '../services/phone';
import { MyApp } from './app.component';

@NgModule({
  declarations: [
    MyApp,
    IdeasPage,
    MessagesPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IdeasPage,
    MessagesPage
  ],

  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  PhoneService
  ]
})
export class AppModule {}
