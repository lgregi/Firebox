import * as firebase from 'firebase';

export class Favoritos {
  public key: any;
  public Favoritar(email: string, dados: any): void {
    dados.email = email;
    console.log(dados);
    firebase
      .database()
      .ref(`favoritos/${btoa(email)}`)
      .push(dados)
      .then((snapshot: any) => {
        this.key = snapshot.key;
        firebase
          .database()
          .ref(`favoritos/${btoa(email)}/${this.key}`)
          .update({ key: dados.key });
        console.log(this.key);
        console.log('Favoritado', dados);
      });
  }

  public consultarFavoritados(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(`favoritos/${btoa(email)}`)
        .orderByChild('email')
        .equalTo(email)
        .once('value')
        .then((snapshot) => {
          let produtos: Array<any> = [];
          snapshot.forEach((childSnapshot: any) => {
            let publicacao = childSnapshot.val();
            publicacao.key = childSnapshot.key;
            produtos.push(publicacao);
            resolve(produtos);
          });
          return produtos.reverse();
        })

        .catch((err: Error) => {
          reject(err);
          console.error(err);
        });
    });
  }

  public async Desfavoritar(email: string, key: any) {
    firebase
      .database()
      .ref(`favoritos/${btoa(email)}/${key}`)
      .remove()
      .then(() => {
        console.log(`favoritos/${btoa(email)}/${key}`);
        console.log('Desfavoritado com sucesso');
      })
      .catch((error) => {
        console.error(`Erro ao desfavoritar: ${error}`);
      });
  }
}
