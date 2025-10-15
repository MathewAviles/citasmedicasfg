"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Lock, Calendar as CalendarIcon, User, Clock, FileText } from "lucide-react"

// Definimos el tipo para un doctor
interface Doctor {
  id: number;
  email: string;
}

// Generar horas para las 24 horas del día
const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

export default function AgendarCitaPage() {
  const { isAuthenticated, user, token } = useAuth()
  const { toast } = useToast()

  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  // Cargar la lista de doctores al montar la página
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/doctors`);
        if (response.ok) {
          const data = await response.json();
          setDoctors(data.doctors);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast({ title: "Error", description: "No se pudo cargar la lista de doctores.", variant: "destructive" });
      }
    };
    fetchDoctors();
  }, [toast]);

  // Lógica para abrir el diálogo de confirmación
  const handleOpenConfirmDialog = () => {
    // --- INICIO DEL CÓDIGO DE DEPURACIÓN ---
    console.log("--- Iniciando validación para abrir diálogo ---");
    console.log("¿Está autenticado?:", isAuthenticated);
    console.log("Doctor seleccionado:", selectedDoctor);
    console.log("Fecha seleccionada:", date);
    console.log("Hora seleccionada:", selectedTime);
    console.log("Motivo:", reason);
    // --- FIN DEL CÓDIGO DE DEPURACIÓN ---

    if (!isAuthenticated) {
      toast({ title: "Error", description: "Debes iniciar sesión para agendar una cita.", variant: "destructive" });
      return;
    }

    if (!selectedDoctor || !date || !selectedTime || !reason) {
      toast({ title: "Campos incompletos", description: "Por favor, selecciona un doctor, fecha, hora y motivo de la cita.", variant: "destructive" });
      // --- CÓDIGO DE DEPURACIÓN ADICIONAL ---
      console.error("¡Validación fallida! Faltan campos.");
      return;
    }

    console.log("¡Validación exitosa! Abriendo diálogo...");
    setIsConfirmOpen(true);
  }

  // Lógica para enviar la cita (llamada desde el diálogo)
  const handleAppointmentSubmit = async () => {
    setIsLoading(true);

    const appointmentDateTime = new Date(date!);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    const isoString = appointmentDateTime.toISOString();

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctor_id: parseInt(selectedDoctor),
          appointment_time: isoString,
          reason: reason,
        }),
      });

      if (response.ok) {
        toast({ title: "¡Cita Agendada!", description: "Su cita ha sido agendada correctamente." });
        // Limpiar formulario y cerrar diálogo
        setSelectedDoctor("");
        setDate(new Date());
        setSelectedTime("");
        setReason("");
        setIsConfirmOpen(false);
      } else {
        const errorData = await response.json();
        toast({ title: "Error al agendar", description: errorData.message || "No se pudo agendar la cita.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({ title: "Error de red", description: "No se pudo conectar con el servidor.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedDoctorInfo = useMemo(() => 
    doctors.find(doc => doc.id === parseInt(selectedDoctor, 10)),
    [doctors, selectedDoctor]
  );

  return (
    <>
      <div className="min-h-screen bg-muted/30">
        <Header />

        <main className="pt-24 md:pt-32 pb-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl md:text-4xl font-bold">Agenda tu Cita</CardTitle>
                <CardDescription className="text-lg text-muted-foreground pt-2">
                  Completa el formulario para reservar tu próxima consulta.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                {!isAuthenticated ? (
                  <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                      <Lock className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                          Inicia sesión para continuar
                      </h3>
                      <p className="text-muted-foreground">
                          Para poder agendar una cita, necesitas una cuenta.
                      </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* ... (resto del formulario sin cambios) ... */}
                    <div className="space-y-2">
                      <Label htmlFor="patient-name" className="text-lg font-semibold">Nombre del Paciente</Label>
                      <Input id="patient-name" value={user?.email || ''} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor" className="text-lg font-semibold">Selecciona un Doctor</Label>
                      <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                        <SelectTrigger id="doctor">
                          <SelectValue placeholder="Elige un doctor..." />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doc) => (
                            <SelectItem key={doc.id} value={String(doc.id)}>
                              {doc.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <div className="space-y-2">
                          <Label className="text-lg font-semibold">Selecciona la Fecha</Label>
                          <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              className="rounded-md border justify-center"
                              disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))}
                          />
                      </div>
                      <div className="space-y-2">
                          <Label className="text-lg font-semibold">Selecciona la Hora</Label>
                          <ToggleGroup type="single" value={selectedTime} onValueChange={(value) => value && setSelectedTime(value)} className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                              {timeSlots.map(time => (
                                  <ToggleGroupItem key={time} value={time} className="text-base">
                                      {time}
                                  </ToggleGroupItem>
                              ))}
                          </ToggleGroup>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason" className="text-lg font-semibold">Motivo de la Cita</Label>
                      <Textarea
                        id="reason"
                        placeholder="Describe brevemente el motivo de tu consulta..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    {/* Botón de Envío Modificado */}
                    <Button
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg"
                      onClick={handleOpenConfirmDialog}
                    >
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      Agendar Cita
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>

      {/* Diálogo de Confirmación */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Confirmar Cita</DialogTitle>
            <DialogDescription>Por favor, revisa los detalles de tu cita antes de confirmar.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-3 text-muted-foreground" />
              <span className="font-medium">Doctor:</span>
              <span className="ml-auto text-muted-foreground">{selectedDoctorInfo?.email || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-3 text-muted-foreground" />
              <span className="font-medium">Fecha:</span>
              <span className="ml-auto text-muted-foreground">{date?.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-3 text-muted-foreground" />
              <span className="font-medium">Hora:</span>
              <span className="ml-auto text-muted-foreground">{selectedTime || "N/A"}</span>
            </div>
            <div className="flex items-start">
              <FileText className="w-5 h-5 mr-3 mt-1 text-muted-foreground" />
              <span className="font-medium">Motivo:</span>
              <p className="ml-auto text-right text-muted-foreground max-w-[70%]">{reason || "No especificado"}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleAppointmentSubmit} disabled={isLoading}>
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> Confirmando...</>
              ) : (
                "Confirmar Definitivamente"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
