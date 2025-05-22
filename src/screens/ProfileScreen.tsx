import React from 'react';
import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ViewStyle } from 'react-native';
import type { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface RoleBadgeProps {
  role: string;
}

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const getRoleText = (role: string): string => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'doctor':
        return 'Médico';
      case 'patient':
        return 'Paciente';
      default:
        return role;
    }
  };

  return (
    <Container>
      <ScrollContainer contentContainerStyle={styles.scrollContent}>
        <HeaderPlaceholder />

        <Title>Meu Perfil</Title>

        <ProfileCard>
          <Avatar source={{ uri: user?.image ?? 'https://via.placeholder.com/150' }} />
          <Name>{user?.name ?? 'Usuário'}</Name>
          <Email>{user?.email ?? 'email@exemplo.com'}</Email>

          <RoleBadge role={user?.role ?? 'unknown'}>
            <RoleText>{getRoleText(user?.role ?? '')}</RoleText>
          </RoleBadge>

          {user?.role === 'doctor' && user.specialty && (
            <SpecialtyText>Especialidade: {user.specialty}</SpecialtyText>
          )}
        </ProfileCard>

        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.button}
          contentStyle={styles.buttonContent}
          accessibilityLabel="Voltar"
        >
          Voltar
        </Button>

        <Button
          mode="contained"
          onPress={signOut}
          style={[styles.button, styles.logoutButton]}
          contentStyle={styles.buttonContent}
          accessibilityLabel="Sair"
        >
          Sair
        </Button>
      </ScrollContainer>
    </Container>
  );
};

const styles: {
  scrollContent: ViewStyle;
  button: ViewStyle;
  buttonContent: ViewStyle;
  logoutButton: ViewStyle;
} = {
  scrollContent: {
    padding: 20,
  },
  button: {
    marginBottom: 20,
    width: '100%' as `${number}%`,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
  },
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const ScrollContainer = styled.ScrollView`
  flex: 1;
`;

const HeaderPlaceholder = styled.View`
  height: 60px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const ProfileCard = styled.View`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 16px;
`;

const Name = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

const Email = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

// Aqui a correção: tipagem explícita do props
const RoleBadge = styled.View<RoleBadgeProps>`
  background-color: ${(props: RoleBadgeProps) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary + '20';
      case 'doctor':
        return theme.colors.success + '20';
      case 'patient':
        return theme.colors.secondary + '20';
      default:
        return theme.colors.warning + '20';
    }
  }};
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const RoleText = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

const SpecialtyText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-top: 8px;
`;

export default ProfileScreen;
