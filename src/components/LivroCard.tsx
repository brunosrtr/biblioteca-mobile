import { Pressable, StyleSheet, Text } from 'react-native';
import { Livro } from '../types/livro';

type LivroCardProps = {
  livro: Livro;
  onPress: () => void;
};

export function LivroCard({ livro, onPress }: LivroCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.titulo}>{livro.titulo}</Text>
      <Text>{livro.autor}</Text>
      <Text style={styles.info}>
        {livro.status}
        {livro.nota ? ` · nota ${livro.nota}` : ''}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 4, padding: 12, marginBottom: 8 },
  titulo: { fontSize: 16, fontWeight: 'bold' },
  info: { color: '#666', marginTop: 4 },
});
