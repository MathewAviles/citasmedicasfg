"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation" // Importar useRouter
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-context"
import { AlertCircle } from "lucide-react"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToRegister: () => void
}

export function LoginDialog({ open, onOpenChange, onSwitchToRegister }: LoginDialogProps) {
  const { login } = useAuth()
  const router = useRouter() // Instanciar el router
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const user = await login(email, password)

    if (user) {
      onOpenChange(false)
      if (user.role === 'doctor') {
        router.push("/dashboard/doctor")
      } else {
        router.push("/agendar_cita")
      }
    } else {
      setError("Credenciales incorrectas. Por favor, verifica tu email y contraseña.")
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Iniciar Sesión</DialogTitle>
          <DialogDescription>Ingresa tus credenciales para acceder a tu cuenta</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">¿No tienes cuenta? </span>
            <button type="button" onClick={onSwitchToRegister} className="text-primary hover:underline font-medium">
              Regístrate aquí
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
