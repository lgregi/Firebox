import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Produto } from '../produtos.service';
import { Router } from '@angular/router';

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
  isLoading: boolean = false;

  constructor(
    private produto: Produto,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.produtosPesquisados = [];
    this.isLoading = true;

    const param = this.route.snapshot.paramMap.get('pesquisa');
    console.log(param);
    this.produto.Pesquisar(param!).subscribe((produtos: any[]) => {
      this.produtosPesquisados = produtos;
      console.log(this.produtosPesquisados);
      this.isLoading = false;
    });
    console.log(this.produtosPesquisados);
  }

  criarIteracoes(numero: number): number[] {
    return Array.from({ length: numero });
  }
}
