import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export function Input(props: TextInputProps) {
  return <TextInput style={styles.input} placeholderTextColor="#888" {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
});
