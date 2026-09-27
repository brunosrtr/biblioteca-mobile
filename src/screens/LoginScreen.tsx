import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Input } from '../components/Input';
import { entrar, traduzirErroAuth } from '../services/authService';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleEntrar() {
    if (!email.trim() || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    try {
      setEnviando(true);
      setErro('');
      await entrar(email, senha);
    } catch (e) {
      setErro(traduzirErroAuth(e));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minha Biblioteca</Text>

      <Input placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Input placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Botao titulo="Entrar" onPress={handleEntrar} carregando={enviando} />
      <Pressable style={styles.link} onPress={() => navigation.navigate('Cadastro')}>
        <Text>Não tem conta? Cadastre-se</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 22, marginBottom: 20, textAlign: 'center' },
  erro: { color: 'red', marginBottom: 10 },
  link: { alignItems: 'center', padding: 12 },
});
