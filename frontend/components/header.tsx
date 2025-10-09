"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, LogIn, LogOut, User } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { LoginDialog } from "@/components/login-dialog"
import { RegisterDialog } from "@/components/register-dialog"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)
  
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleNavClick = (sectionId: string) => {
    setIsMenuOpen(false)
    if (sectionId.startsWith("/")) {
      router.push(sectionId)
      return
    }
    if (pathname === "/") {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      router.push(`/#${sectionId}`)
    }
  }

  const handleSwitchToRegister = () => {
    setShowLoginDialog(false)
    setShowRegisterDialog(true)
  }

  const handleSwitchToLogin = () => {
    setShowRegisterDialog(false)
    setShowLoginDialog(true)
  }

  const allNavItems = [
    { id: "inicio", label: "Inicio" },
    { id: "servicios", label: "Servicios" },
    { id: "informacion", label: "Información" },
    { id: "equipo", label: "Equipo" },
    { id: "/agendar_cita", label: "Contacto" },
  ]

  const navItems = user?.role === 'doctor'
    ? allNavItems.filter(item => item.id !== '/agendar_cita')
    : allNavItems;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-3 cursor-pointer">
              <Image
                src="/fgLogo.png"
                alt="FG Medic Logo"
                width={150}
                height={40}
                className="object-contain"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{user?.name}</span>
                  </div>
                  {user?.role === 'doctor' && (
                    <Button variant="secondary" size="sm" asChild>
                      <Link href="/dashboard/doctor">Panel de Doctor</Link>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex bg-transparent"
                  onClick={() => setShowLoginDialog(true)}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </Button>
              )}
              {user?.role !== 'doctor' && (
                <Button
                  className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="sm"
                  onClick={() => router.push('/agendar_cita')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Agendar Cita
                </Button>
              )}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="text-sm font-medium hover:text-primary transition-colors text-left py-2"
                  >
                    {item.label}
                  </button>
                ))}
                
                <div className="pt-4 border-t border-border mt-2">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg mb-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">{user?.name}</span>
                      </div>
                      {user?.role === 'doctor' && (
                        <Button variant="secondary" className="w-full justify-start mb-2" asChild>
                          <Link href="/dashboard/doctor">Panel de Doctor</Link>
                        </Button>
                      )}
                      <Button variant="outline" className="w-full bg-transparent" onClick={logout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Salir
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowLoginDialog(true)}>
                      <LogIn className="w-4 h-4 mr-2" />
                      Iniciar Sesión
                    </Button>
                  )}
                  {user?.role !== 'doctor' && (
                    <Button
                      className="bg-primary hover:bg-primary/90 text-primary-foreground w-full mt-2"
                      onClick={() => router.push('/agendar_cita')}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Agendar Cita
                    </Button>
                  )}
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

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
    </>
  )
}