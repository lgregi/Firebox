import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Favoritos } from '../favoritos.service';
import { Ofertas } from '../ofertas.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css'],
})
export class ProdutoComponent implements OnInit {
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
    private favoritos: Favoritos
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    firebase.auth().onAuthStateChanged((user: any) => {
      this.email = user.email;
    });
    this.route.paramMap.subscribe((params) => (this.key = params.get('key')));
    this.ofertas.RetornaOferta(this.key!).then((response) => {
      this.produto = response;
      console.log(this.produto);
      this.fotos = this.produto[0].url.slice(1, 4);
      this.fotoPrincipal = this.produto[0].url[0];
      this.isLoading = false;
    });
  }

  mudarFotoPrincipal(indexFoto: number) {
    const aux = this.fotoPrincipal;
    this.fotoPrincipal = this.fotos[indexFoto];
    this.fotos[indexFoto] = aux;
  }

  favoritar() {
    if (!this.estaLogado()) {
      window.alert('Você precisa estar logado para favoritar um produto');
      return;
    }
    console.log(this.email, this.produto[0]);
    this.favoritos.Favoritar(this.email, { ...this.produto[0], key: this.key });
    window.alert('Produto favoritado');
    this.disabled = true;
  }

  estaLogado() {
    const token = window.localStorage.getItem('id_token');
    if (token) {
      return true;
    }
    return false;
  }
}
