"use client";
import { Loading } from "@/components/shared/loading";
import StatCard from "../student/components/student-stat-card";
import { AdminChart } from "./admin-chart";
import { UserCard } from "./user-card";
import { useListUsersQuery } from "@/lib/apis/admin/user-api";
import { BookOpen, GraduationCap, UserCircle, Users } from "lucide-react";
import { useMemo } from "react";

export default function Page() {
  const { data: usersStatistics, isLoading } = useListUsersQuery();

  // Calculer les statistiques et les derniers utilisateurs
  const { stats, recentUsers } = useMemo(() => {
    if (!usersStatistics?.data) {
      return {
        stats: {
          totalUsers: 0,
          totalStudents: 0,
          totalTrainers: 0,
          totalAdmins: 0,
          totalSecretariat: 0,
        },
        recentUsers: [],
      };
    }

    const users = usersStatistics.data.rows;
    const totalUsers = users.length;

    // Compter les utilisateurs par rôle
    let totalStudents = 0;
    let totalTrainers = 0;
    let totalAdmins = 0;
    let totalSecretariat = 0;

    users.forEach((user) => {
      user.roles.forEach((role) => {
        switch (role.role) {
          case "Étudiants":
            totalStudents++;
            break;
          case "Formateurs":
            totalTrainers++;
            break;
          case "Admin":
            totalAdmins++;
            break;
          case "Secrétariat & Administratif":
            totalSecretariat++;
            break;
        }
      });
    });

    // Obtenir les 4 derniers utilisateurs créés
    const sortedUsers = [...users].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const recentUsers = sortedUsers.slice(0, 4).map((user) => ({
      username: `${user.fs_name} ${user.ls_name}`,
      avatar: user.avatar,
      timestamp: new Date(user.createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      role: user.roles[0]?.role || "Utilisateur",
    }));

    return {
      stats: {
        totalUsers,
        totalStudents,
        totalTrainers,
        totalAdmins,
        totalSecretariat,
      },
      recentUsers,
    };
  }, [usersStatistics]);

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Utilisateurs totaux"
          icon={<Users size={20} />}
          value={stats.totalUsers.toString()}
          change="↗ Actuel"
          description="nombre total d'utilisateurs"
        />
        <StatCard
          title="Étudiants"
          icon={<GraduationCap size={20} />}
          value={stats.totalStudents.toString()}
          change="↗ Inscrits"
          description="étudiants enregistrés"
        />
        <StatCard
          title="Formateurs"
          icon={<UserCircle size={20} />}
          value={stats.totalTrainers.toString()}
          change="↗ Actifs"
          description="formateurs disponibles"
        />
        <StatCard
          title="Administrateurs"
          icon={<Users size={20} />}
          value={stats.totalAdmins.toString()}
          change="↗ Actifs"
          description="administrateurs système"
        />
        <StatCard
          title="Secrétariat"
          icon={<BookOpen size={20} />}
          value={stats.totalSecretariat.toString()}
          change="↗ Actifs"
          description="personnel administratif"
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-5 my-5">
        <div className="flex-[2]">
          <AdminChart />
        </div>
        <div className="flex-[1] flex flex-col p-5 gap-10 shadow-sm rounded-md border-t bg-white">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl pb-1.5 text-[#0466C8] font-semibold">
              Activité des utilisateurs
            </h3>
            <p className="text-xs font-light">4 derniers utilisateurs créés</p>
          </div>
          <div className="flex-[1] flex flex-col gap-5 justify-between mb-2.5">
            {recentUsers.length > 0 ? (
              recentUsers.map((user, index) => (
                <UserCard
                  key={index}
                  username={user.username}
                  avatar={user.avatar}
                  timestamp={user.timestamp}
                  role={user.role}
                />
              ))
            ) : (
              <p className="text-gray-500 text-sm">Aucun utilisateur récent</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
