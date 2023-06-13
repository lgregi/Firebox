import { Component } from '@angular/core';

@Component({
  selector: 'app-editar-produto',
  templateUrl: './editar-produto.component.html',
  styleUrls: ['./editar-produto.component.css'],
})
export class EditarProdutoComponent {
  maxFiles = 4;
  fileCount = 0;
  files: any[] = [];

  onFileChange(event: any) {
    this.fileCount = event.target.files.length;
    if (this.fileCount > this.maxFiles) {
      alert(`Por favor, selecione no máximo ${this.maxFiles} arquivos.`);
      event.target.value = '';
    } else {
      this.files = [];
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        if (i >= this.maxFiles) {
          break;
        }
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.files.push({ name: file.name, url: e.target.result });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  exibirImagens(event: any) {
    this.files = [];
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      if (i >= this.maxFiles) {
        break;
      }
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.files.push({ name: file.name, url: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }
}
