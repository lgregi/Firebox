import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Favoritos } from '../favoritos.service';
import { Produto } from '../produtos.service';
import { Ofertas } from '../ofertas.service';
import { Autenticacao } from '../autenticacao.service';

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

  constructor(
    private produtos: Produto,
    private favoritos: Favoritos,
    private Oferta: Ofertas,
    private autenticacao: Autenticacao
  ) {}

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

  async excluirProduto(produto: any) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este anúncio?'
    );
    if (confirmar) {
      await this.produtos.DeletarProduto(produto).then((response) => {
        window.alert('Produto deletado com sucesso');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      });
    }
  }
  async ExcluirConta() {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir a sua conta?'
    );
    if (confirmar) {
      //Todo o restante pra apagar a conta
      try {
        await this.autenticacao.DeletarUsuarioBD(this.email).then(() => {
          this.ApagarTudo(this.email);
        });

        await Promise.all([]);
      } catch (error) {}
    }
  }

  public async ApagarTudo(email: any) {
    await this.autenticacao.DeletarProdutosCadastrados(email).then(() => {
      this.autenticacao.desativarConta().then(() => {
        setTimeout(() => {
          this.autenticacao.sair();
        }, 2500);
      });
    });
  }
}
