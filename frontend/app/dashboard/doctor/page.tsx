"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, FileText, CheckCircle, XCircle, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"

// Tipo para una cita
interface Appointment {
  id: number;
  patient_name: string;
  patient_email: string;
  appointment_time: string;
  reason: string;
  status: 'Confirmada' | 'Atendida' | 'No Asistió';
}

export default function DoctorDashboardPage() {
  const { user, token, isAuthenticated, login } = useAuth()
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [calendarId, setCalendarId] = useState(user?.calendar_id || '')

  useEffect(() => {
    if (user) {
      setCalendarId(user.calendar_id || '')
    }
  }, [user])

  const fetchAppointments = async () => {
    if (!isAuthenticated || user?.role !== 'doctor') return;
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/appointments", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments);
      } else {
        toast({ title: "Error", description: "No se pudieron cargar las citas.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({ title: "Error de red", description: "No se pudo conectar con el servidor.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [isAuthenticated, user, token]);

  const handleUpdateStatus = async (id: number, status: 'Atendida' | 'No Asistió') => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: "Cita actualizada",
          description: `La cita ha sido marcada como "${status}".`,
        });
        fetchAppointments(); // Re-fetch appointments to get the updated list
      } else {
        toast({ title: "Error", description: "No se pudo actualizar el estado de la cita.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast({ title: "Error de red", description: "No se pudo conectar con el servidor.", variant: "destructive" });
    }
  };

  const handleSaveCalendarId = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/doctors/${user.id}/calendar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ calendar_id: calendarId }),
      });

      if (response.ok) {
        toast({
          title: "Configuración guardada",
          description: "Tu ID de calendario ha sido actualizado.",
        });
        // Actualizar el usuario en el contexto para reflejar el cambio
        if(user.email) {
          await login(user.email, ""); // Esto es un truco, requiere que el login se adapte o una nueva función de refresh
        }
      } else {
        toast({ title: "Error", description: "No se pudo guardar el ID del calendario.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error saving calendar ID:", error);
      toast({ title: "Error de red", description: "No se pudo conectar con el servidor.", variant: "destructive" });
    }
  };

  const now = new Date();
  const upcomingAppointments = appointments
    .filter(a => new Date(a.appointment_time) > now)
    .sort((a, b) => new Date(a.appointment_time).getTime() - new Date(b.appointment_time).getTime());
    
  const pastAppointments = appointments
    .filter(a => new Date(a.appointment_time) <= now)
    .sort((a, b) => new Date(b.appointment_time).getTime() - new Date(a.appointment_time).getTime());

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="pt-24 md:pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Panel del Doctor</h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Bienvenido, Dr. {user?.name}. Gestiona tus citas aquí.
                </p>
              </div>
              <Button onClick={() => fetchAppointments()} disabled={isLoading} className="mt-4 md:mt-0">
                {isLoading ? 'Actualizando...' : 'Actualizar Citas'}
              </Button>
            </div>

            <Tabs defaultValue="proximas">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="proximas">
                  Próximas Citas ({upcomingAppointments.length})
                </TabsTrigger>
                <TabsTrigger value="historial">
                  Historial de Citas ({pastAppointments.length})
                </TabsTrigger>
                <TabsTrigger value="configuracion">
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </TabsTrigger>
              </TabsList>
              <TabsContent value="proximas">
                <AppointmentList
                  appointments={upcomingAppointments}
                  isLoading={isLoading}
                  onUpdateStatus={handleUpdateStatus}
                  isUpcoming={true}
                />
              </TabsContent>
              <TabsContent value="historial">
                <AppointmentList
                  appointments={pastAppointments}
                  isLoading={isLoading}
                  isUpcoming={false}
                />
              </TabsContent>
              <TabsContent value="configuracion">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración del Calendario</CardTitle>
                    <CardDescription>
                      Gestiona la integración con tu Google Calendar. Las nuevas citas se añadirán a este calendario.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="calendarId" className="text-sm font-medium">ID de Google Calendar</label>
                      <Input
                        id="calendarId"
                        type="text"
                        placeholder="ID de tu calendario (ej. tuemail@gmail.com)"
                        value={calendarId}
                        onChange={(e) => setCalendarId(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Si dejas esto en blanco, se usará tu email de inicio de sesión por defecto.
                      </p>
                    </div>
                    <Button onClick={handleSaveCalendarId}>Guardar Configuración</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Componente para la lista de citas
const AppointmentList = ({ appointments, isLoading, onUpdateStatus, isUpcoming }: {
  appointments: Appointment[],
  isLoading: boolean,
  onUpdateStatus?: (id: number, status: 'Atendida' | 'No Asistió') => void,
  isUpcoming: boolean
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="ml-4 text-muted-foreground">Cargando citas...</p>
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg mt-4">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground">
          {isUpcoming ? "No tienes próximas citas" : "No hay citas en el historial"}
        </h3>
        <p className="text-muted-foreground mt-2">
          {isUpcoming 
            ? "Cuando un paciente agende una cita, aparecerá aquí."
            : "Las citas completadas o pasadas aparecerán aquí."
          }
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
      {appointments.map(apt => (
        <AppointmentCard key={apt.id} appointment={apt} onUpdateStatus={onUpdateStatus} isUpcoming={isUpcoming} />
      ))}
    </div>
  )
}

// Componente para la tarjeta de cita
const AppointmentCard = ({ appointment, onUpdateStatus, isUpcoming }: {
  appointment: Appointment,
  onUpdateStatus?: (id: number, status: 'Atendida' | 'No Asistió') => void,
  isUpcoming: boolean
}) => {
  const { formattedDate, formattedTime } = formatDateTime(appointment.appointment_time);

  const appointmentDate = new Date(appointment.appointment_time);
  const today = new Date();
  const isToday = appointmentDate.getFullYear() === today.getFullYear() &&
                  appointmentDate.getMonth() === today.getMonth() &&
                  appointmentDate.getDate() === today.getDate();

  const statusColors = {
    'Confirmada': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Atendida': 'bg-green-500/10 text-green-600 border-green-500/20',
    'No Asistió': 'bg-red-500/10 text-red-600 border-red-500/20',
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{appointment.patient_name}</CardTitle>
            <CardDescription className="flex items-center pt-2">
              <Calendar className="w-4 h-4 mr-2" /> {formattedDate}
            </CardDescription>
            <CardDescription className="flex items-center pt-1">
              <Clock className="w-4 h-4 mr-2" /> {formattedTime}
            </CardDescription>
          </div>
          <Badge className={`ml-auto ${statusColors[appointment.status]}`}>
            {appointment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground flex items-start">
          <FileText className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
          <span>{appointment.reason || 'No especificado'}</span>
        </p>
      </CardContent>
      {isUpcoming && onUpdateStatus && isToday && (
        <div className="p-4 border-t flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onUpdateStatus(appointment.id, 'Atendida')}>
            <CheckCircle className="w-4 h-4 mr-2" /> Marcar Atendida
          </Button>
          <Button variant="destructive" size="sm" className="flex-1" onClick={() => onUpdateStatus(appointment.id, 'No Asistió')}>
            <XCircle className="w-4 h-4 mr-2" /> No Asistió
          </Button>
        </div>
      )}
    </Card>
  )
}

const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { formattedDate, formattedTime };
};