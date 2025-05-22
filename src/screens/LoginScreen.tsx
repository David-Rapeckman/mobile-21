import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Input, Button } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type LoginScreenProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const { signIn } = useAuth();
  const navigation = useNavigation<LoginScreenProps>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signIn({ email, password });
    } catch {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Input
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <Input
        label="Senha"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        contentStyle={styles.buttonContent}
        style={styles.button}
      >
        Entrar
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Register')}
        style={styles.registerButton}
      >
        Cadastrar Novo Paciente
      </Button>

      <Text style={styles.hint}>Use as credenciais de exemplo:</Text>
      <Text style={styles.credentials}>
        Admin: admin@example.com / 123456{'\n'}
        Médicos: joao@example.com, maria@example.com, pedro@example.com / 123456
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: theme.colors.text,
  },
  input: {
    marginBottom: 15,
    backgroundColor: theme.colors.background,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  button: {
    marginTop: 10,
    width: '100%',
    backgroundColor: theme.colors.primary,
  },
  registerButton: {
    marginTop: 10,
    width: '100%',
    borderColor: theme.colors.secondary,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 10,
  },
  hint: {
    marginTop: 20,
    textAlign: 'center',
    color: theme.colors.text,
  },
  credentials: {
    marginTop: 10,
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: 12,
  },
});

export default LoginScreen;
