import React, { useState } from 'react';
import styled from 'styled-components/native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';
import { ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type RegisterScreenProps = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const { register } = useAuth();
  const navigation = useNavigation<RegisterScreenProps>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, password });
      navigation.navigate('Login');
    } catch {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Cadastro de Paciente</Title>

      <TextInput
        label="Nome completo"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />

      {error ? <ErrorText>{error}</ErrorText> : null}

      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Cadastrar
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Login')}
        style={styles.backButton}
        contentStyle={styles.buttonContent}
      >
        Voltar para Login
      </Button>
    </Container>
  );
};

const styles = {
  input: {
    marginBottom: 15,
  } as ViewStyle,
  button: {
    marginTop: 10,
    width: '100%',
    backgroundColor: theme.colors.primary,
  } as ViewStyle,
  backButton: {
    marginTop: 10,
    width: '100%',
    borderColor: theme.colors.secondary,
  } as ViewStyle,
  buttonContent: {
    paddingVertical: 12,
  } as ViewStyle,
};

const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: ${theme.colors.text};
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

export default RegisterScreen;
