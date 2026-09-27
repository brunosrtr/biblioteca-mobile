function doisDigitos(numero: number) {
  return String(numero).padStart(2, '0');
}

export function converterData(texto: string): string | null {
  const partes = texto.split('/');
  if (partes.length !== 3) return null;

  const [dia, mes, ano] = partes.map(Number);
  const data = new Date(ano, mes - 1, dia);

  if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
    return null;
  }
  return `${ano}-${doisDigitos(mes)}-${doisDigitos(dia)}`;
}

export function formatarData(dataIso: string) {
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function hoje() {
  const agora = new Date();
  return `${agora.getFullYear()}-${doisDigitos(agora.getMonth() + 1)}-${doisDigitos(agora.getDate())}`;
}
