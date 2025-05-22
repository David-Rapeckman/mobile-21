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

type PatientDashboardScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  'PatientDashboard'
>;

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface StyledProps {
  status: string;
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

const PatientDashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<PatientDashboardScreenProps>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = useCallback(async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
        const userAppointments = allAppointments.filter(
          (appointment) => appointment.patientId === user?.id
        );
        setAppointments(userAppointments);
      } else {
        setAppointments([]);
      }
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [loadAppointments])
  );

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Minhas Consultas</Title>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreateAppointment')}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Agendar Nova Consulta
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Profile')}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Meu Perfil
        </Button>

        {loading ? (
          <LoadingText>Carregando consultas...</LoadingText>
        ) : appointments.length === 0 ? (
          <EmptyText>Nenhuma consulta agendada</EmptyText>
        ) : (
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id}>
              <PatientName style={styles.patientName}>
                Paciente: {appointment.patientName}
              </PatientName>
              <DateTime style={styles.dateTime}>
                {appointment.date} às {appointment.time}
              </DateTime>
              <DoctorName style={styles.doctorName}>{appointment.doctorName}</DoctorName>
              <Specialty style={styles.specialty}>{appointment.specialty}</Specialty>
              <StatusBadge status={appointment.status}>
                <StatusText status={appointment.status}>
                  {getStatusText(appointment.status)}
                </StatusText>
              </StatusBadge>
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
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
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

const AppointmentCard = styled.View`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const PatientName = styled.Text``;
const DateTime = styled.Text``;
const DoctorName = styled.Text``;
const Specialty = styled.Text``;

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

export default PatientDashboardScreen;
