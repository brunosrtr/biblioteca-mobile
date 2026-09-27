import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { LivroCard } from '../components/LivroCard';
import { observarLivros } from '../services/livroService';
import { Livro } from '../types/livro';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Livros'>;

export function LivrosScreen({ navigation }: Props) {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

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

  return (
    <View style={styles.container}>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <FlatList
        data={livros}
        keyExtractor={(livro) => livro.id}
        renderItem={({ item }) => (
          <LivroCard livro={item} onPress={() => navigation.navigate('Detalhes', { id: item.id })} />
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum livro cadastrado ainda.</Text>}
      />

      <Botao titulo="Adicionar livro" onPress={() => navigation.navigate('Formulario')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  erro: { color: 'red', marginBottom: 10 },
  vazio: { textAlign: 'center', color: '#666', marginTop: 40 },
});
