import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacidad | KARTAZO",
  description: "Politica de privacidad de KARTAZO.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#07070F] px-6 py-16 text-[#F2F2FF]">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-8 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
        >
          Volver al inicio
        </Link>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#FF5E00]">
            Legal
          </p>
          <h1 className="mt-3 font-condensed text-4xl font-black text-white md:text-6xl">
            Politica de privacidad
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
            En KARTAZO cuidamos los datos personales de nuestros usuarios y
            buscamos limitar al minimo la informacion sensible visible en la
            plataforma. Esta pagina resume como recopilamos, usamos y protegemos
            la informacion dentro de la experiencia del album.
          </p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-white/75 md:text-base">
            <section>
              <h2 className="text-xl font-bold text-white">1. Datos que recopilamos</h2>
              <p className="mt-2">
                Podemos recopilar nombre de usuario, correo electronico,
                imagen de perfil, equipo favorito, progreso dentro del album,
                actividad de compra o intercambio y datos tecnicos necesarios
                para operar la autenticacion, seguridad y rendimiento del
                producto.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">2. Como usamos la informacion</h2>
              <p className="mt-2">
                Usamos esta informacion para crear tu cuenta, permitir el uso
                del album, mostrar progreso, procesar compras, mejorar la
                experiencia del producto y proteger la plataforma frente a
                abuso, fraude o uso indebido.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">3. Contenido generado por usuarios</h2>
              <p className="mt-2">
                Las cartas sociales creadas por usuarios pueden incluir enlaces
                externos a imagenes. KARTAZO no promete propiedad sobre esas
                imagenes y se reserva el derecho de bloquear, ocultar o remover
                contenido que infrinja derechos de terceros, sea ofensivo o
                represente un riesgo para la seguridad del servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">4. Visibilidad de la informacion</h2>
              <p className="mt-2">
                Datos como nombre de usuario, avatar, equipo favorito y progreso
                social pueden ser visibles dentro de experiencias comunitarias
                como ranking, marketplace o actividad. Informacion privada como
                correos electronicos y datos administrativos solo es accesible
                por administradores autorizados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">5. Seguridad</h2>
              <p className="mt-2">
                Aplicamos controles razonables de autenticacion, restricciones
                para enlaces externos, separacion de roles administrativos y
                buenas practicas de despliegue. Ningun sistema es perfecto, por
                lo que te recomendamos usar contrasenas seguras y no compartir
                credenciales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">6. Contacto</h2>
              <p className="mt-2">
                Si necesitas solicitar acceso, correccion o eliminacion de
                informacion personal, puedes escribirnos por medio de la pagina
                de contacto disponible en KARTAZO.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
