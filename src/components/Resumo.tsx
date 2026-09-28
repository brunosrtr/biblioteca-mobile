import { StyleSheet, Text, View } from 'react-native';

type ResumoProps = {
  ano: number;
  lidosNoAno: number;
  lendo: number;
  media: number | null;
};

export function Resumo({ ano, lidosNoAno, lendo, media }: ResumoProps) {
  return (
    <View style={styles.container}>
      <Text>Lidos em {ano}: {lidosNoAno}</Text>
      <Text>Lendo agora: {lendo}</Text>
      <Text>Média das notas: {media === null ? 'sem notas' : media.toFixed(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderWidth: 1, borderColor: '#ddd', borderRadius: 4, padding: 12, marginBottom: 12 },
});
