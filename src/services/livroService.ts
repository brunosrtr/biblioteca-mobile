import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Livro, LivroDados } from '../types/livro';

function colecaoLivros() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado.');
  return collection(db, 'users', uid, 'livros');
}

export function observarLivros(aoMudar: (livros: Livro[]) => void, aoFalhar: () => void) {
  const consulta = query(colecaoLivros(), orderBy('titulo'));

  return onSnapshot(
    consulta,
    (snapshot) => {
      const livros = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...(documento.data() as LivroDados),
      }));
      aoMudar(livros);
    },
    aoFalhar,
  );
}

export function observarLivro(id: string, aoMudar: (livro: Livro | null) => void, aoFalhar: () => void) {
  return onSnapshot(
    doc(colecaoLivros(), id),
    (documento) => {
      if (!documento.exists()) {
        aoMudar(null);
        return;
      }
      aoMudar({ id: documento.id, ...(documento.data() as LivroDados) });
    },
    aoFalhar,
  );
}

export async function buscarLivro(id: string): Promise<Livro | null> {
  const documento = await getDoc(doc(colecaoLivros(), id));
  if (!documento.exists()) return null;
  return { id: documento.id, ...(documento.data() as LivroDados) };
}

export async function criarLivro(dados: LivroDados) {
  await addDoc(colecaoLivros(), dados);
}

export async function atualizarLivro(id: string, dados: LivroDados) {
  await updateDoc(doc(colecaoLivros(), id), dados);
}

export async function excluirLivro(id: string) {
  await deleteDoc(doc(colecaoLivros(), id));
}
