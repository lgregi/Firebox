import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Favoritos } from '../favoritos.service';
import { Produto } from '../produtos.service';

@Component({
  selector: 'app-pagina-usuario',
  templateUrl: './pagina-usuario.component.html',
  styleUrls: ['./pagina-usuario.component.css'],
})
export class PaginaUsuarioComponent implements OnInit {
  produtosCriados: any;
  email: any;
  dadosUsuarios: any;
  favoritados: any;

  constructor(private produtos: Produto, private favoritos: Favoritos) {}

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged((user: any) => {
      console.log(user);
      if (user) {
        this.email = user.email;
        console.log(user);
        this.produtos
          .consultarProdutosPorusuario(this.email)
          .then((produtos) => {
            this.produtosCriados = produtos;
            console.log(this.produtosCriados, produtos);
          })
          .catch((error) => console.log(error));
        this.produtos.acessarDadosUsuario(this.email).then((dadosUsuarios) => {
          this.dadosUsuarios = dadosUsuarios;
          console.log(dadosUsuarios);
        });
        this.favoritos.consultarFavoritados(this.email).then((response) => {
          this.favoritados = response;
          console.log(this.favoritados);
        });
      }
    });
  }

  excluirProduto(produto: any) {
    this.produtos.DeletarProduto(produto).then((response) => {
      window.alert('Produto deletado com sucesso');
      window.location.reload();
    });
  }
}
