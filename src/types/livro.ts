export type StatusLeitura = 'Quero ler' | 'Lendo' | 'Lido';

export type Livro = {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  status: StatusLeitura;
  nota: number | null;
  dataConclusao: string | null;
};

export type LivroDados = Omit<Livro, 'id'>;
