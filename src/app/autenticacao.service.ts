import { Usuario } from './acesso/usuario.model';
import * as firebase from 'firebase';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Autenticacao {
  public token_id: any;

  constructor(private rotas: Router) {}

  public async CadastrarUser(usuario: Usuario): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(usuario.email, usuario.senha)
      .then((resposta: any) => {
        firebase
          .database()
          .ref(`usuario_detalhe/${btoa(resposta.email)}`)
          .push(usuario);
        alert('Usuário cadastrado com sucesso');
        this.rotas.navigate(['/login']);
      })
      .catch((err: Error) => console.log(err))
      .then((resposta: any) => {
        console.log(resposta);
      });
  }

  // autenticação utilizando a função nativa do firebase "signInWithEmailAndPassword"
  public async autenticar(email: string, senha: string): Promise<any> {
    console.log(
      'autenticação realizada com sucesso através do sistema de autenticação do FireBase:'
    );
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, senha)
      .then((resposta: any) => {
        alert('Autenticação realizada com sucesso');
        firebase
          .auth()
          .currentUser?.getIdToken()
          .then((id: string) => {
            this.token_id = id;
            console.log(this.token_id);
            //serve para não deslogar se a página for recarregada, armazenando o token no localstorage
            localStorage.setItem('id_token', id);

            // redireciona para a rota após login
            // this.rotas.navigate(['/'])
            this.rotas.navigate(['/usuario']);
          });
      })
      .catch((err: Error) => {
        alert('algo deu errado');
        console.log(err);
      });
  }

  // deleta usuário do banco de dados
  public async DeletarUsuarioBD(email: string): Promise<any> {
    const deletar = firebase.database().ref(`usuario_detalhe/${btoa(email)}`);

    try {
      await deletar.remove();
      console.log('Dados deletados com sucesso');
    } catch (err) {
      console.log(err);
    }
  }

  //esta função só funcionará se o usuário estiver autenticado e deleta apenas do sistema de autenticação

  public async desativarConta() {
    firebase
      .auth()
      .currentUser?.delete()
      .then(() => {
        alert('Conta desativada com sucesso');
        // this.rotas.navigate(['/cadastro']);
      })
      .catch((err: Error) => console.log(err));
  }

  public autenticado(): boolean {
    let ok: boolean = false;
    // enquanto o token o id_token estiver aramazenado no localstorage,  o sistema sabe que o usuário está logado
    if (localStorage.getItem('id_token') != null) {
      this.token_id = localStorage.getItem('id_token');
      ok = true;
    }
    // se não tiver autenticado, direciona para a rota raiz
    if (this.token_id === undefined) {
      ok = false;
      this.rotas.navigate(['/']);
    }
    return ok;
  }

  // função para deslogar, deletando o id aramazenado no localstorage e deslogando do firebase
  public sair() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem('id_token');
        this.token_id = undefined;
        this.rotas.navigate(['/']);
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }

  public async DeletarProdutosCadastrados(email: string): Promise<any> {
    let key: Array<any> = [];
    let url: Array<any> = [];
    let ok: boolean = true;
    return new Promise((resolve, reject) => {
      this.DeletarProdutosFavoritados(email);
      firebase
        .database()
        .ref(`produtos`)
        .orderByChild('email')
        .equalTo(email)
        .once('value')
        .then((snapshot) => {
          let produtos: Array<any> = [];
          snapshot.forEach((childSnapshot: any) => {
            let publicacao = childSnapshot.val();
            publicacao.key = childSnapshot.key;
            publicacao.url = childSnapshot.val().url;
            produtos.push(publicacao);
          });
          produtos.forEach((keys: any) => {
            key = keys.key;
            url = keys.url;
            for (let i = 0; i < url.length; i++) {
              if (i === 0) {
                firebase
                  .storage()
                  .ref()
                  .child(`${key}/${key}`)
                  .delete()
                  .then(() => {
                    console.log('deletado do storage 1');
                  });
              } else if (i === 1) {
                firebase
                  .storage()
                  .ref()
                  .child(`${key}/${key}1`)
                  .delete()
                  .then(() => {
                    console.log('deletado do storage 2');
                  });
              } else if (i === 2) {
                firebase
                  .storage()
                  .ref()
                  .child(`${key}/${key}2`)
                  .delete()
                  .then(() => {
                    console.log('deletado do storage 3');
                  });
              } else if (i === 3) {
                firebase
                  .storage()
                  .ref()
                  .child(`${key}/${key}3`)
                  .delete()
                  .then(() => {
                    console.log('deletado do storage 4');
                  });
              }
              firebase
                .database()
                .ref(`produtos/${key}`)
                .remove()
                .then(() => {
                  // console.log('deletado')
                });
            }
          });
          resolve(ok);
        })
        .catch((err: Error) => {
          reject(err);
          console.error(err);
        });
    });
  }

  public DeletarProdutosFavoritados(email: any): void {
    firebase
      .database()
      .ref(`favoritos/${btoa(email)}`)
      .remove()
      .then(() => {
        console.log('Desfavoritado com sucesso');
      })
      .catch((error) => {
        console.log(`Erro ao desfavoritar: ${error}`);
      });
  }
}
