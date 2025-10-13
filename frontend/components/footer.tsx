import { MapPin, Phone, Instagram, Facebook } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/fgLogo.png"
                  alt="FG Medic Logo"
                  width={150}
                  height={40}
                  className="object-contain"
                />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Atención médica profesional y de calidad para ti y tu familia.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-foreground">0978829127</p>
                  <p className="text-foreground">0983780452</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">
                  Riobamba, 11 de Noviembre y Milton Reyes
                  <br />
                  Consultorio FG Medic, segundo piso
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Síguenos</h4>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/fg.medic"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5 text-primary" />
              </a>
              <a
                href="https://www.instagram.com/fg_medic"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5 text-secondary" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              
              <br />
              
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FG.MEDIC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
