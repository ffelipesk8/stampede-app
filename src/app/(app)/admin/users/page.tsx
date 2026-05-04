import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getAuthenticatedAdmin } from "@/lib/admin";

export const metadata = {
  title: "Admin Users · KARTAZO",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) notFound();

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      email: true,
      countryCode: true,
      favoriteTeam: true,
      level: true,
      xp: true,
      coins: true,
      isPro: true,
      onboardingStep: true,
      createdAt: true,
      lastActiveAt: true,
    },
  });

  const totals = {
    totalUsers: users.length,
    proUsers: users.filter((user) => user.isPro).length,
    onboardingCompleted: users.filter((user) => user.onboardingStep >= 5).length,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-400">
          Admin Only
        </p>
        <h1 className="mt-2 text-3xl font-black text-white">Usuarios registrados</h1>
        <p className="mt-2 text-sm text-white/60">
          Esta vista solo debe estar disponible para tu correo configurado en{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">ADMIN_EMAILS</code>.
        </p>
        <p className="mt-1 text-xs text-white/40">Sesión admin: {admin.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Usuarios" value={totals.totalUsers.toString()} />
        <StatCard label="PRO" value={totals.proUsers.toString()} />
        <StatCard label="Onboarding completo" value={totals.onboardingCompleted.toString()} />
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0B0D16]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-white/45">
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">País</th>
                <th className="px-4 py-3">Equipo</th>
                <th className="px-4 py-3">Nivel</th>
                <th className="px-4 py-3">XP</th>
                <th className="px-4 py-3">Coins</th>
                <th className="px-4 py-3">PRO</th>
                <th className="px-4 py-3">Onboarding</th>
                <th className="px-4 py-3">Creado</th>
                <th className="px-4 py-3">Última actividad</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-white/5 text-white/80">
                  <td className="px-4 py-3 font-semibold text-white">@{user.username}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.countryCode ?? "—"}</td>
                  <td className="px-4 py-3">{user.favoriteTeam ?? "—"}</td>
                  <td className="px-4 py-3">{user.level}</td>
                  <td className="px-4 py-3">{user.xp.toLocaleString()}</td>
                  <td className="px-4 py-3">{user.coins.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${
                        user.isPro
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {user.isPro ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{user.onboardingStep}/5</td>
                  <td className="px-4 py-3">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">{formatDate(user.lastActiveAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function formatDate(date: Date | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
