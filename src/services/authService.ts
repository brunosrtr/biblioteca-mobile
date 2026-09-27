import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export async function cadastrar(email: string, senha: string) {
  const credencial = await createUserWithEmailAndPassword(auth, email.trim(), senha);
  return credencial.user;
}

export async function entrar(email: string, senha: string) {
  const credencial = await signInWithEmailAndPassword(auth, email.trim(), senha);
  return credencial.user;
}

export async function sair() {
  await signOut(auth);
}

const mensagensDeErro: Record<string, string> = {
  'auth/invalid-email': 'E-mail inválido.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/network-request-failed': 'Sem conexão com a internet.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente de novo.',
};

export function traduzirErroAuth(erro: unknown): string {
  if (erro instanceof FirebaseError) {
    return mensagensDeErro[erro.code] ?? 'Não foi possível concluir. Tente novamente.';
  }
  return 'Erro inesperado. Tente novamente.';
}