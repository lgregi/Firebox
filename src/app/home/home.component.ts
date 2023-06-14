import { Component, OnInit } from '@angular/core';
import { Produto } from '../produtos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  principaisProdutos: any;
  eletronicos: any;
  moda_acessorios: any;
  casa_decoracao: any;
  automoveis: any;
  esportes_lazer: any;
  beleza_cuidados_pessoais: any;
  livros_filmes_musica: any;
  saude_bem_estar: any;
  outros: any;
  isLoading: boolean = false;
  promises: Promise<any>[] = [];
  constructor(private produtos: Produto) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.promises.push(
      this.produtos.consultarProdutosPaginados(6, 1).then((produtos) => {
        console.log(this.principaisProdutos, produtos);
        this.principaisProdutos = produtos;
      })
    );
    this.promises.push(
      this.produtos
        .consultarProdutosPorCategoria('eletronicos')
        .then((produtos) => (this.eletronicos = produtos.slice(0, 6)))
    );
    this.promises.push(
      this.produtos
        .consultarProdutosPorCategoria('moda-acessorios')
        .then((produtos) => (this.moda_acessorios = produtos.slice(0, 6)))
    );
    this.promises.push(
      this.produtos
        .consultarProdutosPorCategoria('casa-decoracao')
        .then((produtos) => (this.casa_decoracao = produtos.slice(0, 6)))
    );
    this.promises.push(
      this.produtos
        .consultarProdutosPorCategoria('automoveis')
        .then((produtos) => (this.automoveis = produtos.slice(0, 6)))
    );
    this.promises.push(
      this.produtos
        .consultarProdutosPorCategoria('esportes-lazer')
        .then((produtos) => (this.esportes_lazer = produtos.slice(0, 6)))
    );
    this.promises.push(
      this.produtos
        .consultarProdutosPorCategoria('beleza-cuidados-pessoais')
        .then(
          (produtos) => (this.beleza_cuidados_pessoais = produtos.slice(0, 6))
        )
    );
    this.promises.push(
      this.produtos
        .consultarProdutosPorCategoria('livros-filmes-musica')
        .then((produtos) => (this.livros_filmes_musica = produtos.slice(0, 6)))
    );
    this.promises.push(
      this.produtos
        .consultarProdutosPorCategoria('saude-bem-estar')
        .then((produtos) => (this.saude_bem_estar = produtos.slice(0, 6)))
    );
    this.promises.push(
      this.produtos
        .consultarProdutosPorCategoria('outros')
        .then((produtos) => (this.outros = produtos.slice(0, 6)))
    );
    Promise.all(this.promises)
      .then(() => {
        console.log('Promises resolvidas');
      })
      .catch((error) => {
        console.log('Houve Erro');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
