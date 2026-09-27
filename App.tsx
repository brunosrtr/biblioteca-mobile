import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import { auth } from './src/config/firebase';
import { CadastroScreen } from './src/screens/CadastroScreen';
import { DetalhesScreen } from './src/screens/DetalhesScreen';
import { FormularioScreen } from './src/screens/FormularioScreen';
import { LivrosScreen } from './src/screens/LivrosScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { sair } from './src/services/authService';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const cancelarObservacao = onAuthStateChanged(auth, (usuarioAtual) => {
      setUser(usuarioAtual);
      setCarregando(false);
    });
    return cancelarObservacao;
  }, []);

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="Livros"
              component={LivrosScreen}
              options={{ title: 'Meus livros', headerRight: () => <Button title="Sair" onPress={sair} /> }}
            />
            <Stack.Screen name="Detalhes" component={DetalhesScreen} options={{ title: 'Detalhes' }} />
            <Stack.Screen
              name="Formulario"
              component={FormularioScreen}
              options={({ route }) => ({ title: route.params?.id ? 'Editar livro' : 'Novo livro' })}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Criar conta' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
