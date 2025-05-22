import React, { useState, useCallback } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AdminDashboardScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  'AdminDashboard'
>;

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return theme.colors.success;
    case 'cancelled':
      return theme.colors.error;
    default:
      return theme.colors.warning;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmada';
    case 'cancelled':
      return 'Cancelada';
    default:
      return 'Pendente';
  }
};

const AdminDashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<AdminDashboardScreenProps>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      } else {
        setAppointments([]);
      }

      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        setUsers([]);
      }
    } catch {
      setAppointments([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleUpdateStatus = async (
    appointmentId: string,
    newStatus: 'confirmed' | 'cancelled'
  ) => {
    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
        const updatedAppointments = allAppointments.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
        );
        await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(updatedAppointments));
        loadData();
      }
    } catch {
      // silent error
    }
  };

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Painel Administrativo</Title>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('UserManagement')}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Gerenciar Usuários
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Profile')}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Meu Perfil
        </Button>

        <SectionTitle>Últimas Consultas</SectionTitle>
        {loading ? (
          <LoadingText>Carregando dados...</LoadingText>
        ) : appointments.length === 0 ? (
          <EmptyText>Nenhuma consulta agendada</EmptyText>
        ) : (
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id}>
              <DoctorName style={styles.doctorName}>{appointment.doctorName}</DoctorName>
              <Specialty style={styles.specialty}>{appointment.specialty}</Specialty>
              <DateTime style={styles.dateTime}>
                {appointment.date} às {appointment.time}
              </DateTime>
              <StatusBadge status={appointment.status}>
                <StatusText status={appointment.status}>{getStatusText(appointment.status)}</StatusText>
              </StatusBadge>
              {appointment.status === 'pending' && (
                <ButtonContainer>
                  <Button
                    mode="contained"
                    onPress={() => handleUpdateStatus(appointment.id, 'confirmed')}
                    style={[styles.actionButton, styles.confirmButton]}
                    contentStyle={styles.buttonContent}
                  >
                    Confirmar
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => handleUpdateStatus(appointment.id, 'cancelled')}
                    style={[styles.actionButton, styles.cancelButton]}
                    contentStyle={styles.buttonContent}
                  >
                    Cancelar
                  </Button>
                </ButtonContainer>
              )}
            </AppointmentCard>
          ))
        )}

        <Button
          mode="contained"
          onPress={signOut}
          style={[styles.button, styles.logoutButton]}
          contentStyle={styles.buttonContent}
        >
          Sair
        </Button>
      </ScrollView>
    </Container>
  );
};

const styles = {
  scrollContent: {
    padding: 20,
  },
  button: {
    marginBottom: 20,
    width: '100%',
  } as ViewStyle,
  buttonContent: {
    paddingVertical: 12,
  } as ViewStyle,
  logoutButton: {
    backgroundColor: theme.colors.error,
  } as ViewStyle,
  actionButton: {
    marginTop: 8,
    width: '48%',
  } as ViewStyle,
  confirmButton: {
    backgroundColor: theme.colors.success,
  } as ViewStyle,
  cancelButton: {
    backgroundColor: theme.colors.error,
  } as ViewStyle,
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  } as TextStyle,
  specialty: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  } as TextStyle,
  dateTime: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  } as TextStyle,
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 15px;
  margin-top: 10px;
`;

const AppointmentCard = styled.View`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const DoctorName = styled.Text``;
const Specialty = styled.Text``;
const DateTime = styled.Text``;

const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const StatusBadge = styled.View<{ status: string }>`
  background-color: ${(props: { status: string }) => getStatusColor(props.status) + '20'};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;

const StatusText = styled.Text<{ status: string }>`
  color: ${(props: { status: string }) => getStatusColor(props.status)};
  font-size: 12px;
  font-weight: 500;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;

export default AdminDashboardScreen;
