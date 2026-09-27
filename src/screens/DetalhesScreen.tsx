import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { excluirLivro, observarLivro } from '../services/livroService';
import { Livro } from '../types/livro';
import { RootStackParamList } from '../types/navigation';
import { formatarData } from '../utils/data';

type Props = NativeStackScreenProps<RootStackParamList, 'Detalhes'>;

export function DetalhesScreen({ navigation, route }: Props) {
  const { id } = route.params;

  const [livro, setLivro] = useState<Livro | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const pararDeObservar = observarLivro(
      id,
      (livroAtual) => {
        setLivro(livroAtual);
        setCarregando(false);
      },
      () => {
        setErro('Não foi possível carregar o livro.');
        setCarregando(false);
      },
    );
    return pararDeObservar;
  }, [id]);

  function confirmarExclusao() {
    Alert.alert('Excluir livro', 'Tem certeza que deseja excluir este livro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: handleExcluir },
    ]);
  }

  async function handleExcluir() {
    try {
      setExcluindo(true);
      await excluirLivro(id);
      navigation.goBack();
    } catch {
      setErro('Não foi possível excluir. Tente novamente.');
      setExcluindo(false);
    }
  }

  if (carregando || excluindo) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!livro) {
    return (
      <View style={styles.centro}>
        <Text>{erro || 'Livro não encontrado.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{livro.titulo}</Text>
      <Text style={styles.linha}>Autor: {livro.autor}</Text>
      <Text style={styles.linha}>Gênero: {livro.genero}</Text>
      <Text style={styles.linha}>Status: {livro.status}</Text>
      <Text style={styles.linha}>Nota: {livro.nota ?? 'sem nota'}</Text>
      {livro.dataConclusao ? (
        <Text style={styles.linha}>Concluído em: {formatarData(livro.dataConclusao)}</Text>
      ) : null}

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <View style={styles.botoes}>
        <Botao titulo="Editar" onPress={() => navigation.navigate('Formulario', { id })} />
        <Botao titulo="Excluir" onPress={confirmarExclusao} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  linha: { marginBottom: 6 },
  erro: { color: 'red', marginTop: 10 },
  botoes: { marginTop: 20 },
});
