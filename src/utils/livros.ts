import { Livro, StatusLeitura } from '../types/livro';

export type FiltroStatus = StatusLeitura | 'Todos';

export function filtrarLivros(livros: Livro[], busca: string, status: FiltroStatus) {
  const termo = busca.trim().toLowerCase();

  return livros.filter((livro) => {
    const combinaStatus = status === 'Todos' || livro.status === status;
    const combinaTexto =
      livro.titulo.toLowerCase().includes(termo) || livro.autor.toLowerCase().includes(termo);
    return combinaStatus && combinaTexto;
  });
}

export function calcularResumo(livros: Livro[], ano: number) {
  const lidosNoAno = livros.filter(
    (livro) => livro.status === 'Lido' && livro.dataConclusao?.startsWith(String(ano)),
  ).length;

  const lendo = livros.filter((livro) => livro.status === 'Lendo').length;

  const comNota = livros.filter((livro) => livro.nota !== null);
  const somaNotas = comNota.reduce((soma, livro) => soma + (livro.nota ?? 0), 0);
  const media = comNota.length > 0 ? somaNotas / comNota.length : null;

  return { lidosNoAno, lendo, media };
}
