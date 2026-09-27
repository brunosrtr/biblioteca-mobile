import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Botao } from '../components/Botao';
import { Input } from '../components/Input';
import { atualizarLivro, buscarLivro, criarLivro } from '../services/livroService';
import { LivroDados, StatusLeitura } from '../types/livro';
import { RootStackParamList } from '../types/navigation';
import { converterData, formatarData, hoje } from '../utils/data';

type Props = NativeStackScreenProps<RootStackParamList, 'Formulario'>;

const OPCOES_STATUS: StatusLeitura[] = ['Quero ler', 'Lendo', 'Lido'];

export function FormularioScreen({ navigation, route }: Props) {
  const id = route.params?.id;

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [genero, setGenero] = useState('');
  const [status, setStatus] = useState<StatusLeitura>('Quero ler');
  const [nota, setNota] = useState('');
  const [data, setData] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(Boolean(id));
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!id) return;
    buscarLivro(id)
      .then((livro) => {
        if (!livro) return;
        setTitulo(livro.titulo);
        setAutor(livro.autor);
        setGenero(livro.genero);
        setStatus(livro.status);
        setNota(livro.nota ? String(livro.nota) : '');
        setData(livro.dataConclusao ? formatarData(livro.dataConclusao) : '');
      })
      .catch(() => setErro('Não foi possível carregar o livro.'))
      .finally(() => setCarregando(false));
  }, [id]);

  async function handleSalvar() {
    if (!titulo.trim() || !autor.trim() || !genero.trim()) {
      setErro('Preencha título, autor e gênero.');
      return;
    }

    let notaNumero: number | null = null;
    if (nota.trim()) {
      notaNumero = Number(nota);
      if (!Number.isInteger(notaNumero) || notaNumero < 1 || notaNumero > 5) {
        setErro('A nota deve ser um número inteiro de 1 a 5.');
        return;
      }
    }

    let dataConclusao: string | null = null;
    if (status === 'Lido') {
      if (!data.trim()) {
        setErro('Informe a data de conclusão.');
        return;
      }
      dataConclusao = converterData(data.trim());
      if (!dataConclusao) {
        setErro('Data inválida. Use o formato DD/MM/AAAA.');
        return;
      }
      if (dataConclusao > hoje()) {
        setErro('A data de conclusão não pode estar no futuro.');
        return;
      }
    }

    const dados: LivroDados = {
      titulo: titulo.trim(),
      autor: autor.trim(),
      genero: genero.trim(),
      status,
      nota: notaNumero,
      dataConclusao,
    };

    try {
      setSalvando(true);
      setErro('');
      if (id) {
        await atualizarLivro(id, dados);
      } else {
        await criarLivro(dados);
      }
      navigation.goBack();
    } catch {
      setErro('Não foi possível salvar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Input placeholder="Título" value={titulo} onChangeText={setTitulo} />
      <Input placeholder="Autor" value={autor} onChangeText={setAutor} />
      <Input placeholder="Gênero" value={genero} onChangeText={setGenero} />

      <Text style={styles.label}>Status</Text>
      <View style={styles.opcoes}>
        {OPCOES_STATUS.map((opcao) => (
          <Pressable
            key={opcao}
            style={[styles.opcao, status === opcao && styles.opcaoSelecionada]}
            onPress={() => setStatus(opcao)}
          >
            <Text style={status === opcao ? styles.textoSelecionado : undefined}>{opcao}</Text>
          </Pressable>
        ))}
      </View>

      <Input placeholder="Nota de 1 a 5 (opcional)" value={nota} onChangeText={setNota} keyboardType="number-pad" />

      {status === 'Lido' ? (
        <Input placeholder="Data de conclusão (DD/MM/AAAA)" value={data} onChangeText={setData} />
      ) : null}

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Botao titulo="Salvar" onPress={handleSalvar} carregando={salvando} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  label: { marginBottom: 6 },
  opcoes: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  opcao: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, paddingVertical: 8, paddingHorizontal: 12 },
  opcaoSelecionada: { backgroundColor: '#333', borderColor: '#333' },
  textoSelecionado: { color: '#fff' },
  erro: { color: 'red', marginBottom: 10 },
});
