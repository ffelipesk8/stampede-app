import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terminos | KARTAZO",
  description: "Terminos de uso de KARTAZO.",
};

export default function TermsPage() {
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
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#FFB800]">
            Legal
          </p>
          <h1 className="mt-3 font-condensed text-4xl font-black text-white md:text-6xl">
            Terminos de uso
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
            Estos terminos regulan el acceso y uso de KARTAZO. Al crear una
            cuenta o usar el servicio aceptas estas reglas y te comprometes a
            usar la plataforma de forma responsable.
          </p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-white/75 md:text-base">
            <section>
              <h2 className="text-xl font-bold text-white">1. Uso permitido</h2>
              <p className="mt-2">
                Puedes usar KARTAZO para coleccionar, abrir sobres, participar
                en experiencias sociales y crear cartas con enlaces externos
                propios o autorizados. No esta permitido usar el servicio para
                fraude, suplantacion, abuso, spam o distribucion de contenido
                ilegal.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">2. Cuenta y acceso</h2>
              <p className="mt-2">
                Eres responsable por la seguridad de tu cuenta y por la
                actividad que ocurra dentro de ella. Podemos suspender o
                restringir acceso si detectamos violaciones a estos terminos o
                conductas que pongan en riesgo a la comunidad.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">3. Contenido del usuario</h2>
              <p className="mt-2">
                Mantienes la responsabilidad sobre el contenido que compartes en
                cartas sociales, nombres, textos o enlaces externos. Al subir o
                registrar ese contenido declaras que cuentas con los permisos
                necesarios para usarlo y mostrarlo dentro de la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">4. Economia y compras</h2>
              <p className="mt-2">
                Las funciones premium, compras de sobres o monedas virtuales
                pueden estar sujetas a precios, disponibilidad y reglas propias
                del procesador de pagos. KARTAZO puede ajustar productos,
                beneficios o dinamicas economicas del juego cuando sea
                necesario.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">5. Propiedad intelectual</h2>
              <p className="mt-2">
                El software, la marca KARTAZO, la interfaz y los elementos
                originales del producto pertenecen a sus titulares. Los usuarios
                no adquieren derechos sobre el software por usar la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">6. Cambios y disponibilidad</h2>
              <p className="mt-2">
                Podemos actualizar funciones, reglas, catalogos, recompensas o
                integraciones en cualquier momento para mantener el servicio
                estable, seguro y alineado con la evolucion del producto.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
