import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Favoritos } from '../favoritos.service';
import { Ofertas } from '../ofertas.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-produto-favoritado',
  templateUrl: './produto-favoritado.component.html',
  styleUrls: ['./produto-favoritado.component.css'],
})
export class ProdutoFavoritadoComponent implements OnInit {
  fotos: string[] = [];
  fotoPrincipal: string = '';
  key: string | null = '';
  produto: any;
  isLoading: boolean = false;
  usuario: any;
  email: string = '';
  disabled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private ofertas: Ofertas,
    private favoritos: Favoritos,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    firebase.auth().onAuthStateChanged((user: any) => {
      this.email = user.email;
      this.route.paramMap.subscribe((params) => (this.key = params.get('key')));
      console.log(this.email, this.key);
      this.ofertas
        .RetornaOfertaFavoritada(user.email, this.key!)
        .then((response) => {
          this.produto = response;
          console.log(this.produto);
          this.fotos = this.produto[0].url.slice(1, 4);
          this.fotoPrincipal = this.produto[0].url[0];
          this.isLoading = false;
        });
    });
  }

  mudarFotoPrincipal(indexFoto: number) {
    const aux = this.fotoPrincipal;
    this.fotoPrincipal = this.fotos[indexFoto];
    this.fotos[indexFoto] = aux;
  }

  desfavoritar() {
    if (!this.estaLogado()) {
      window.alert('Você precisa estar logado para desfavoritar um produto');
      return;
    }
    console.log(this.email, this.produto[0]);
    this.favoritos.Desfavoritar(this.email, this.key!).then((response) => {
      console.log(response);
      window.alert('Produto desfavoritado');
      this.router.navigate(['/usuario/']);
    });
  }

  estaLogado() {
    const token = window.localStorage.getItem('id_token');
    if (token) {
      return true;
    }
    return false;
  }
}
