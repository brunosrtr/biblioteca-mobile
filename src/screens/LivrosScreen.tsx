import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Chip } from '../components/Chip';
import { Input } from '../components/Input';
import { LivroCard } from '../components/LivroCard';
import { Resumo } from '../components/Resumo';
import { observarLivros } from '../services/livroService';
import { Livro } from '../types/livro';
import { RootStackParamList } from '../types/navigation';
import { calcularResumo, filtrarLivros, FiltroStatus } from '../utils/livros';

type Props = NativeStackScreenProps<RootStackParamList, 'Livros'>;

const OPCOES_FILTRO: FiltroStatus[] = ['Todos', 'Quero ler', 'Lendo', 'Lido'];

export function LivrosScreen({ navigation }: Props) {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<FiltroStatus>('Todos');

  useEffect(() => {
    const pararDeObservar = observarLivros(
      (lista) => {
        setLivros(lista);
        setCarregando(false);
      },
      () => {
        setErro('Não foi possível carregar os livros.');
        setCarregando(false);
      },
    );
    return pararDeObservar;
  }, []);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const livrosFiltrados = filtrarLivros(livros, busca, filtro);
  const anoAtual = new Date().getFullYear();
  const resumo = calcularResumo(livros, anoAtual);

  return (
    <View style={styles.container}>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Resumo ano={anoAtual} {...resumo} />

      <Input placeholder="Buscar por título ou autor" value={busca} onChangeText={setBusca} />

      <View style={styles.filtros}>
        {OPCOES_FILTRO.map((opcao) => (
          <Chip key={opcao} texto={opcao} selecionado={filtro === opcao} onPress={() => setFiltro(opcao)} />
        ))}
      </View>

      <FlatList
        data={livrosFiltrados}
        keyExtractor={(livro) => livro.id}
        renderItem={({ item }) => (
          <LivroCard livro={item} onPress={() => navigation.navigate('Detalhes', { id: item.id })} />
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            {livros.length === 0 ? 'Nenhum livro cadastrado ainda.' : 'Nenhum livro encontrado.'}
          </Text>
        }
      />

      <Botao titulo="Adicionar livro" onPress={() => navigation.navigate('Formulario')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  erro: { color: 'red', marginBottom: 10 },
  filtros: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  vazio: { textAlign: 'center', color: '#666', marginTop: 40 },
});
