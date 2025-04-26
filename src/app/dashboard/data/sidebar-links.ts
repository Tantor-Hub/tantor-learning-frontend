import {
  LayoutDashboard,
  FileText,
  Users,
  MessageCircleMore,
  BarChart2,
  CalendarDays,
  PlusCircle,
  File,
  GraduationCap,
  User,
  ChartColumn,
  CircleUserRound,
  CircleHelp,
  LucideIcon,
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
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navSecondary: NavSecondary[];
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
      title: "Mes Cours",
      url: "student/courses",
      icon: FileText,
    },
    {
      title: "Messages",
      url: "student/messages",
      icon: MessageCircleMore,
    },
    {
      title: "Mes Documents",
      url: "student/documents",
      icon: ChartColumn,
    },
    {
      title: "Planning",
      url: "student/planning",
      icon: CalendarDays,
    },
  ],
  admin: [
    {
      title: "Tableau de Bord",
      url: "admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Gestion des Cours",
      url: "admin/courses",
      icon: FileText,
    },
    {
      title: "Gestion Utilisateurs",
      url: "admin/users",
      icon: Users,
    },
    {
      title: "Mes Documents",
      url: "admin/documents",
      icon: BarChart2,
    },
    {
      title: "Messages",
      url: "admin/messages",
      icon: MessageCircleMore,
    },
    {
      title: "Dossiers étudiants",
      url: "admin/student-files",
      icon: PlusCircle,
    },
    {
      title: "Planning",
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
      title: "Cours et évaluations",
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
      title: "Mes Documents",
      url: "instructor/documents",
      icon: BarChart2,
    },
    {
      title: "Planning",
      url: "instructor/planning",
      icon: CalendarDays,
    },
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
      title: "Cours",
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
      title: "Planning",
      url: "secretary/planning",
      icon: CalendarDays,
    },
  ],
};

const otherNav: OtherNavItems = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
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
};

export default navigationMenus;
export { otherNav };
export type { Role };
