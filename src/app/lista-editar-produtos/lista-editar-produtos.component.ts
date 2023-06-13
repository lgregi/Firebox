import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Produto } from '../produtos.service';

@Component({
  selector: 'app-lista-editar-produtos',
  templateUrl: './lista-editar-produtos.component.html',
  styleUrls: ['./lista-editar-produtos.component.css'],
})
export class ListaEditarProdutosComponent implements OnInit {
  produtosCriados: any;
  email: any;

  constructor(private produtos: Produto) {}

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged((user: any) => {
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
        console.log(this.produtosCriados);
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
