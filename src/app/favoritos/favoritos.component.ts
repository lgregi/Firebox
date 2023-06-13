import { Component, OnInit } from '@angular/core';
import { Favoritos } from '../favoritos.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css'],
})
export class FavoritosComponent implements OnInit {
  produtosFavoritados: any;
  email: string = '';

  constructor(private favoritos: Favoritos) {}

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged((user: any) => {
      this.email = user.email;
      this.favoritos
        .consultarFavoritados(this.email)
        .then((response) => {
          this.produtosFavoritados = response;
          console.log(response);
        })
        .catch((error) => console.log(error));
    });
  }
}
