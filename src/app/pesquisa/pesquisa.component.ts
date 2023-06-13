import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Produto } from '../produtos.service';

@Component({
  selector: 'app-pesquisa',
  templateUrl: './pesquisa.component.html',
  styleUrls: ['./pesquisa.component.css'],
})
export class PesquisaComponent implements OnInit {
  numeroIteracoes: number = 10;
  caregorias: string[] = [
    'eletronicos',
    'moda-acessorios',
    'casa-decoracao',
    'automoveis',
    'esportes-lazer',
    'beleza-cuidados-pessoais',
    'livros-filmes-musica',
    'saude-bem-estar',
    'alimentos-bebidas',
    'outros',
  ];
  produtosPesquisados: any;

  constructor(private produto: Produto, private route: ActivatedRoute) {}

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('pesquisa');
    const paramFormatado = param!
      .toLocaleLowerCase()
      .replace('ô', 'o')
      .replace('ó', 'o')
      .replace('ç', 'c')
      .replace('ã', 'a');
    if (this.caregorias.includes(paramFormatado)) {
      this.produto
        .consultarProdutosPorCategoria(paramFormatado)
        .then((produto) => (this.produtosPesquisados = produto));
    } else {
      this.produtosPesquisados = this.produto
        .Pesquisar(param!)
        .subscribe((produtos: any[]) => {
          this.produtosPesquisados = produtos;
          console.log(this.produtosPesquisados);
        });
      console.log(this.produtosPesquisados);
    }
  }

  criarIteracoes(numero: number): number[] {
    return Array.from({ length: numero });
  }
}
