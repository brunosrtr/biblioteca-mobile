import { Pressable, StyleSheet, Text } from 'react-native';

type ChipProps = {
  texto: string;
  selecionado: boolean;
  onPress: () => void;
};

export function Chip({ texto, selecionado, onPress }: ChipProps) {
  return (
    <Pressable style={[styles.chip, selecionado && styles.selecionado]} onPress={onPress}>
      <Text style={selecionado ? styles.textoSelecionado : undefined}>{texto}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, paddingVertical: 6, paddingHorizontal: 10 },
  selecionado: { backgroundColor: '#333', borderColor: '#333' },
  textoSelecionado: { color: '#fff' },
});
