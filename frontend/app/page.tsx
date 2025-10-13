"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import {
  Heart,
  Stethoscope,
  Syringe,
  Activity,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/components/auth-context"
import { useState } from "react"
import { LoginDialog } from "@/components/login-dialog"
import { RegisterDialog } from "@/components/register-dialog"

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")

  const handleAppointmentClick = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true)
    } else {
      const element = document.getElementById("contacto")
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setShowImageModal(true)
  }

  const handleSwitchToRegister = () => {
    setShowLoginDialog(false)
    setShowRegisterDialog(true)
  }

  const handleSwitchToLogin = () => {
    setShowRegisterDialog(false)
    setShowLoginDialog(true)
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section id="inicio" className="pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
                Tu salud es nuestra <span className="text-primary">prioridad</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed text-pretty">
                Atención médica profesional y personalizada en Riobamba. Cuidamos de ti y tu familia con dedicación y
                experiencia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleAppointmentClick}
                >
                  {isAuthenticated ? (
                    <>
                      <Phone className="w-5 h-5 mr-2" />
                      Agendar Cita
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Iniciar Sesión para Agendar
                    </>
                  )}
                </Button>
                <Button size="lg" variant="outline">
                  <MapPin className="w-5 h-5 mr-2" />
                  Ver Ubicación
                </Button>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-foreground font-medium">0978829127</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-secondary" />
                  <span className="text-foreground font-medium">0983780452</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/design-mode/1.jpeg"
                  alt="Equipo médico FG.MEDIC"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg hidden md:block">
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8" />
                  <div>
                    <p className="text-2xl font-bold">100+</p>
                    <p className="text-sm opacity-90">Pacientes atendidos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nuestros Servicios</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Ofrecemos atención médica integral con los más altos estándares de calidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Medicina General</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Atención y control médico integral. Valoración del índice de masa corporal y seguimiento
                  personalizado.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Syringe className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Implantes Subdérmicos</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Colocación de implantes anticonceptivos de 3 y 5 años. Método seguro y efectivo a tu alcance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Control y Prevención</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Seguimiento de enfermedades crónicas como hipertensión y diabetes. Prevención y educación en salud.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Atención Médica Integral</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  En FG.MEDIC ofrecemos atención médica integral para toda la familia. Contamos con servicios de planificación familiar, control de enfermedades crónicas y respiratorias, atención del niño sano y enfermo, curaciones, suturas, atención médica domiciliaria y manejo de casos COVID-19.
                </p>
              </div>
              <div className="relative rounded-xl overflow-hidden">
                <Image
                  src="/images/design-mode/2.jpeg"
                  alt="Atención Médica Integral"
                  width={500}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Information Section */}
      <section id="informacion" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Información de Salud</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Conoce los síntomas y cuándo acudir al médico
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hipertensión */}
            <Card className="overflow-hidden">
              <div 
                className="relative aspect-video cursor-pointer"
                onClick={() => handleImageClick("/images/design-mode/hipertension.jpg")}
              >
                <Image
                  src="/images/design-mode/hipertension.jpg"
                  alt="Síntomas de Hipertensión"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-foreground mb-4">Hipertensión: Síntomas y Signos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Hemorragia nasal</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Mareo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Dolor en el tórax</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Presión alta</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Palpitaciones</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Cefalea</span>
                  </div>
                </div>
                <p className="mt-6 text-sm text-muted-foreground bg-primary/5 p-4 rounded-lg">
                  Si experimentas estos síntomas, acude de inmediato al médico o atiéndete con nosotros.
                </p>
              </CardContent>
            </Card>

            {/* Diabetes */}
            <Card className="overflow-hidden">
              <div 
                className="relative aspect-video cursor-pointer"
                onClick={() => handleImageClick("/images/design-mode/diabetes.jpg")}
              >
                <Image
                  src="/images/design-mode/diabetes.jpg"
                  alt="Síntomas de Diabetes"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-foreground mb-4">Diabetes: Síntomas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Mucha sed</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Orinar frecuentemente</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Agotamiento</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Pérdida de peso</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Siempre con hambre</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Hormigueos en manos y pies</span>
                  </div>
                </div>
                <p className="mt-6 text-sm text-muted-foreground bg-secondary/5 p-4 rounded-lg">
                  Si experimentas estos síntomas, acude de inmediato al médico o atiéndete con nosotros.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="equipo" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nuestro Equipo</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Profesionales dedicados a tu bienestar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="relative h-80">
                <Image
                  src="/images/design-mode/jeo.jpeg"
                  alt="Dra. Jeoandy Fiallos"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">Dra. Jeoandy Fiallos</h3>
                <p className="text-muted-foreground">Médico General</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-80">
                <Image
                  src="/images/design-mode/jese.jpeg"
                  alt="Dra. Yesenia Fiallos."
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">Dra. Yesenia Fiallos</h3>
                <p className="text-muted-foreground">Médico General</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Agenda tu Cita</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Estamos aquí para atenderte. Contáctanos por cualquiera de nuestros canales
              </p>
            </div>

            {!isAuthenticated && (
              <Card className="mb-8 border-2 border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">Inicia sesión para agendar tu cita</h3>
                      <p className="text-muted-foreground mb-4">
                        Para poder agendar una cita médica, necesitas crear una cuenta o iniciar sesión.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowRegisterDialog(true)}>
                          Crear Cuenta
                        </Button>
                        <Button variant="outline" onClick={() => setShowLoginDialog(true)}>
                          Iniciar Sesión
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Teléfonos</h3>
                      <p className="text-muted-foreground mb-3">Llámanos o escríbenos por WhatsApp</p>
                      <div className="space-y-2">
                        <a href="tel:0978829127" className="block text-lg font-medium text-primary hover:underline">
                          0978829127
                        </a>
                        <a href="tel:0983780452" className="block text-lg font-medium text-primary hover:underline">
                          0983780452
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Ubicación</h3>
                      <p className="text-muted-foreground mb-3">Visítanos en nuestro consultorio</p>
                      <p className="text-foreground leading-relaxed">
                        Riobamba
                        <br />
                        11 de Noviembre y Milton Reyes
                        <br />
                        Consultorio FG Medic, segundo piso
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 bg-gradient-to-r from-primary to-secondary text-white">
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-3">Horario de Atención</h3>
                <p className="text-lg opacity-90 mb-6">Agenda tu cita llamando a nuestros números de contacto</p>
                {isAuthenticated ? (
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                    <Phone className="w-5 h-5 mr-2" />
                    Llamar Ahora
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90"
                    onClick={() => setShowLoginDialog(true)}
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Inicia Sesión para Agendar
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />

      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl">
          <div className="relative aspect-video">
            {selectedImage && <Image src={selectedImage} alt="Imagen ampliada" fill className="object-contain" />}
          </div>
        </DialogContent>
      </Dialog>

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterDialog
        open={showRegisterDialog}
        onOpenChange={setShowRegisterDialog}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  )
}