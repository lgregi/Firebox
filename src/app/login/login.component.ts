import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Autenticacao } from '../autenticacao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public formulario: FormGroup = new FormGroup({
    email: new FormControl(null),
    senha: new FormControl(null),
  });

  constructor(private autenticacao: Autenticacao) {}

  @Output() public exibirPainel: EventEmitter<string> =
    new EventEmitter<string>();

  ngOnInit(): void {}

  public exibircadastro() {
    this.exibirPainel.emit('cadastro');
  }

  public autenticar(): void {
    this.autenticacao
      .autenticar(
        this.formulario.value.email,
        btoa(this.formulario.value.senha)
      )
      .then(() => {})
      .catch((err) => console.log(err));
  }
  /*
  public deletar(): void {
    this.autenticacao.DeletarUsuarioBD(this.formulario.value.email)
      .then(()=>{
        //this.autenticacao.desativarConta()
        console.log('teste')
      }).catch(()=>console.log(''))
    //this.autenticacao.desativarConta()
  
  }
*/
}
