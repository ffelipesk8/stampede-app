import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contacto | KARTAZO",
  description: "Canales de contacto de KARTAZO.",
};

export default function ContactPage() {
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
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#E8003D]">
            Soporte
          </p>
          <h1 className="mt-3 font-condensed text-4xl font-black text-white md:text-6xl">
            Contacto
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
            Si necesitas ayuda con tu cuenta, reportar un problema, revisar un
            cobro o solicitar soporte administrativo, aqui tienes el canal
            principal para comunicarte con nosotros.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <h2 className="text-lg font-bold text-white">Correo principal</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Escribenos a{" "}
                <a
                  href="mailto:felipealbertolopez@gmail.com"
                  className="font-semibold text-[#FFB800] hover:text-white"
                >
                  felipealbertolopez@gmail.com
                </a>{" "}
                para soporte, acceso administrativo, incidencias o solicitudes
                relacionadas con privacidad.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <h2 className="text-lg font-bold text-white">Que incluir</h2>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-white/70">
                <li>Tu correo de acceso en KARTAZO.</li>
                <li>Una descripcion breve del problema.</li>
                <li>Captura de pantalla si aplica.</li>
                <li>Fecha y hora aproximada del incidente.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
