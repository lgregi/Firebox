import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Usuario } from '../acesso/usuario.model';
import { Autenticacao } from 'src/app/autenticacao.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
})
export class CadastroComponent implements OnInit {
  warning: string = '';
  formularioAlterado = false;
  isLoading: boolean = false;

  get telefoneControl(): FormControl {
    return this.formulario.get('telefoneControl') as FormControl;
  }

  //atributo contralador dos inputs no HTML
  formulario: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    nome_completo: new FormControl(null),
    telefone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{11}$'),
    ]),
    nome_usuario: new FormControl(null),
    senha: new FormControl(null),
  });

  // instanciando o serviço de autenticação
  constructor(private autenticacao: Autenticacao) {}

  ngOnInit(): void {}

  // serve para disparar eventos para o component pai
  @Output() public exibirpainel: EventEmitter<string> =
    new EventEmitter<string>();

  public exibirlogin(): void {
    this.exibirpainel.emit('login');
  }

  validarEmail(): void {
    const emailFormControl = this.formulario.get('email');
    if (emailFormControl && emailFormControl.touched) {
      emailFormControl.setErrors(null);
      if (emailFormControl.invalid) {
        emailFormControl.markAsTouched();
      }
    }
  }

  CadastrarUsuario(): void {
    if (
      this.formulario.value.senha.length < 6 ||
      this.formulario.value.nome_usuario.length < 3 ||
      this.formulario.value.nome_completo.length < 3
    ) {
      alert('Preencha todos os campos');
    } else {
      this.isLoading = true;
      this.warning = '';
      this.formularioAlterado = false;
      // Verifica se o formulário é válido
      if (this.formulario.valid) {
        this.isLoading = true;
        const usuario: Usuario = new Usuario(
          this.formulario.value.email,
          this.formulario.value.nome_completo,
          this.formulario.value.telefone,
          this.formulario.value.nome_usuario,
          btoa(this.formulario.value.senha)
        );

        this.autenticacao
          .CadastrarUser(usuario)
          .then(() => {
            this.exibirlogin();
            this.isLoading = false;
          })
          .catch((err) => {
            this.warning = 'Formulário inválido';
            this.isLoading = false;
          });
      } else {
        console.log(this.formulario.valid);
        // Formulário inválido, exibir mensagem de erro ou realizar outras ações
        this.warning = 'Formulário inválido';
        this.isLoading = false;
      }
    }
  }
}
