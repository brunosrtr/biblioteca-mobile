import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type BotaoProps = {
  titulo: string;
  onPress: () => void;
  carregando?: boolean;
};

export function Botao({ titulo, onPress, carregando = false }: BotaoProps) {
  return (
    <Pressable style={styles.botao} onPress={onPress} disabled={carregando}>
      {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.texto}>{titulo}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  texto: {
    color: '#fff',
  },
});
