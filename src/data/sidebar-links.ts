import {
  LayoutDashboard,
  FileText,
  Users,
  MessageCircleMore,
  BarChart2,
  CalendarDays,
  File,
  GraduationCap,
  User,
  ChartColumn,
  CircleUserRound,
  CircleHelp,
  LucideIcon,
  Shapes,
  Bell,
  BadgeEuro,
} from "lucide-react";

interface NavigationMenu {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
}

type Role = "student" | "secretary" | "admin" | "instructor";

type NavigationMenus = {
  [key in Role]: NavigationMenu[];
};

interface NavSecondary {
  title: string;
  url: string;
  icon: LucideIcon;
}
interface OtherNavItems {
  navSecondary: {
    [key in Role]: NavSecondary[];
  };
}

const navigationMenus: NavigationMenus = {
  student: [
    {
      title: "Tableau de bord",
      url: "student",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Matières",
      url: "student/courses",
      icon: FileText,
    },
    {
      title: "Messages",
      url: "student/messages",
      icon: MessageCircleMore,
    },
    {
      title: "Documents",
      url: "student/documents",
      icon: ChartColumn,
    },
    {
      title: "Emploi du temps",
      url: "student/planning",
      icon: CalendarDays,
    },
    // {
    //   title: "Notifications",
    //   url: "student/notifications",
    //   icon: Bell,
    // },
  ],
  admin: [
    {
      title: "Tableau de Bord",
      url: "admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Matières",
      url: "admin/courses",
      icon: FileText,
    },
    {
      title: "Utilisateurs",
      url: "admin/users",
      icon: Users,
    },
    {
      title: "Documents",
      url: "admin/documents",
      icon: BarChart2,
    },
    {
      title: "Messages",
      url: "admin/messages",
      icon: MessageCircleMore,
    },
    {
      title: "Emploi du temps",
      url: "admin/planning",
      icon: CalendarDays,
    },
  ],
  instructor: [
    {
      title: "Tableau de Bord",
      url: "instructor",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Matières et évaluations",
      url: "instructor/courses",
      icon: FileText,
    },
    {
      title: "Mes Etudiants",
      url: "instructor/students",
      icon: GraduationCap,
    },
    {
      title: "Messages",
      url: "instructor/messages",
      icon: MessageCircleMore,
    },
    {
      title: "Documents",
      url: "instructor/documents",
      icon: BarChart2,
    },
    {
      title: "Emploi du temps",
      url: "instructor/planning",
      icon: CalendarDays,
    },
    // {
    //   title: "Notifications",
    //   url: "student/notifications",
    //   icon: Bell,
    // },
  ],
  secretary: [
    {
      title: "Tableau de Bord",
      url: "secretary",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Utilisateurs",
      url: "secretary/users",
      icon: User,
    },
    {
      title: "Formations",
      url: "secretary/training",
      icon: Shapes,
      isActive: true,
    },
    {
      title: "Matières",
      url: "secretary/courses",
      icon: FileText,
    },
    {
      title: "Documents",
      url: "secretary/documents",
      icon: File,
    },
    {
      title: "Messages",
      url: "secretary/messages",
      icon: MessageCircleMore,
    },
    {
      title: "Emploi du temps",
      url: "secretary/planning",
      icon: CalendarDays,
    },
    {
      title: "Inscriptions",
      url: "secretary/payment",
      icon: BadgeEuro,
    },
    // {
    //   title: "Notifications",
    //   url: "student/notifications",
    //   icon: Bell,
    // },
  ],
};

const otherNav: OtherNavItems = {
  navSecondary: {
    student: [
      {
        title: "Profile",
        url: "student/profile",
        icon: CircleUserRound,
      },
      {
        title: "Support",
        url: "student/support",
        icon: CircleHelp,
      },
    ],
    admin: [
      {
        title: "Profile",
        url: "admin/profile",
        icon: CircleUserRound,
      },
    ],
    instructor: [
      {
        title: "Profile",
        url: "instructor/profile",
        icon: CircleUserRound,
      },
    ],
    secretary: [
      {
        title: "Profile",
        url: "secretary/profile",
        icon: CircleUserRound,
      },
    ],
  },
};

export default navigationMenus;
export { otherNav };
export type { Role };
