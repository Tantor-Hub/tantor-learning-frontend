"use client";
import { Loading } from "@/components/shared/loading";
import StatCard from "../student/components/student-stat-card";
import { AdminChart } from "./admin-chart";
import { UserCard } from "./user-card";
import { useListUsersQuery, useListSubscribersQuery } from "@/lib/apis/admin/user-api";
import { BookOpen, GraduationCap, UserCircle, Users, Mail } from "lucide-react";
import { useMemo } from "react";
import Link from "next/link";
import { UserRole } from "@/types/user";

export default function Page() {
  const { data: usersStatistics, isLoading: isUsersLoading } = useListUsersQuery();
  const { data: subscribersData, isLoading: isSubscribersLoading } = useListSubscribersQuery();

  // Calculer les statistiques et les derniers utilisateurs
  const { stats, recentUsers, subscriberCount } = useMemo(() => {
    if (!usersStatistics?.data) {
      return {
        stats: {
          totalUsers: 0,
          totalStudents: 0,
          totalTrainers: 0,
          totalAdmins: 0,
          totalSecretariat: 0,
          totalSubscribers: 0,
        },
        recentUsers: [],
        subscriberCount: 0,
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
      switch (user.role) {
        case UserRole.STUDENT:
          totalStudents++;
          break;
        case UserRole.INSTRUCTOR:
          totalTrainers++;
          break;
        case UserRole.ADMIN:
          totalAdmins++;
          break;
        case UserRole.SECRETARY:
          totalSecretariat++;
          break;
      }
    });

    // Obtenir les 4 derniers utilisateurs créés
    const sortedUsers = [...users].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    const recentUsers = sortedUsers.slice(0, 4).map((user) => ({
      username: `${user.firstName || ""} ${user.lastName || ""}`,
      avatar: user.avatar,
      timestamp: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "",
      role: user.role,
    }));

    const subscriberCount = subscribersData?.data.length || 0;

    return {
      stats: {
        totalUsers,
        totalStudents,
        totalTrainers,
        totalAdmins,
        totalSecretariat,
        totalSubscribers: subscriberCount,
      },
      recentUsers,
      subscriberCount,
    };
  }, [usersStatistics, subscribersData]);

  if (isUsersLoading || isSubscribersLoading) return <Loading />;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          url="/admin/users"
          title="Utilisateurs totaux"
          icon={<Users size={20} />}
          value={stats.totalUsers.toString()}
          change="↗ Actuel"
          description="nombre total d'utilisateurs"
        />
        <StatCard
          url="/admin/users?tab=student"
          title="Étudiants"
          icon={<GraduationCap size={20} />}
          value={stats.totalStudents.toString()}
          change="↗ Inscrits"
          description="étudiants enregistrés"
        />
        <StatCard
          url="/admin/users?tab=instructor"
          title="Formateurs"
          icon={<UserCircle size={20} />}
          value={stats.totalTrainers.toString()}
          change="↗ Actifs"
          description="formateurs disponibles"
        />
        <StatCard
          url="/admin/users?tab=admin"
          title="Administrateurs"
          icon={<Users size={20} />}
          value={stats.totalAdmins.toString()}
          change="↗ Actifs"
          description="administrateurs système"
        />
        <StatCard
          url="/admin/users?tab=secretary"
          title="Secrétariat"
          icon={<BookOpen size={20} />}
          value={stats.totalSecretariat.toString()}
          change="↗ Actifs"
          description="personnel administratif"
        />
        <StatCard
          url="/admin/users?tab=subscriber"
          title="Abonnés"
          icon={<Mail size={20} />}
          value={stats.totalSubscribers.toString()}
          change="↗ Actuels"
          description="nombre d'abonnés à la newsletter"
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
                  avatar={user.avatar || ""}
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
