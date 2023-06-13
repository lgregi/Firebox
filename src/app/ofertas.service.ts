import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
@Injectable()
export class Ofertas {
  public oferta: any;
  public key: any;

  constructor(private router: Router) {}

  public RetornaOferta(key: string): Promise<any> {
    let get: Array<any> = [];
    let set: any;
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(`produtos/${key}`)
        .once('value')
        .then((ofeta) => {
          set = ofeta.val();
          get.push(set);
          resolve(get);
        })
        .catch((err: any) => {
          console.log(err);
        });
    });
  }

  public RetornaOfertaFavoritada(email: any, key: string): Promise<any> {
    let get: Array<any> = [];
    let set: any;
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(`favoritos/${btoa(email)}/${key}`)
        .once('value')
        .then((ofeta) => {
          set = ofeta.val();
          get.push(set);
          resolve(get);
        })
        .catch((err: any) => {
          console.log(err);
          reject(err);
        });
    });
  }
}
