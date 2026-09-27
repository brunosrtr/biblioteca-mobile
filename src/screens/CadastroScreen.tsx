import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Input } from '../components/Input';
import { cadastrar, traduzirErroAuth } from '../services/authService';

export function CadastroScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleCadastrar() {
    if (!email.trim() || !senha || !confirmacao) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmacao) {
      setErro('As senhas não coincidem.');
      return;
    }
    try {
      setEnviando(true);
      setErro('');
      await cadastrar(email, senha);
    } catch (e) {
      setErro(traduzirErroAuth(e));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Input placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Input placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <Input placeholder="Confirmar senha" value={confirmacao} onChangeText={setConfirmacao} secureTextEntry />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Botao titulo="Criar conta" onPress={handleCadastrar} carregando={enviando} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  erro: { color: 'red', marginBottom: 10 },
});
