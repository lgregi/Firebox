import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  showHome = true;

  ngOnInit() {
    const firebaseConfig = {
      apiKey: 'AIzaSyC1Gt3Yy7VcLaOI_5VJx8APk_JL9uve0eo',
      authDomain: 'firebox-841fc.firebaseapp.com',
      databaseURL: 'https://firebox-841fc-default-rtdb.firebaseio.com',
      projectId: 'firebox-841fc',
      storageBucket: 'firebox-841fc.appspot.com',
      messagingSenderId: '763892990586',
      appId: '1:763892990586:web:72a94cf8a56eb4f4ff31c3',
    };

    firebase.initializeApp(firebaseConfig);
  }
}
