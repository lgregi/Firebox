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
    //this.contador ++
    //console.log("Teste de recuperação dos dados de cadastro:",this.contador , usuario);
    //para colocar o usuário no sistema de utenticaçoa do firebase
    return firebase
      .auth()
      .createUserWithEmailAndPassword(usuario.email, usuario.senha)
      .then((resposta: any) => {
        // para relacionar o e-mail ao restante dos atributos do usuario
        //o campo "usuario_detalhe" está sendo criado aqui e faz referencia ao trecho -
        // databaseURL: "https://firebox-754d7-default-rtdb.firebaseio.com", existente no app.component.ts
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

  public desativarConta(): void {
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
}
