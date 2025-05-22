"use client";
import { useState, useEffect } from "react";
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetUserProfileQuery } from "@/lib/apis/users-api";

type UserDataProps = {
  id: number;
  fs_name: string;
  ls_name: string;
  nick_name: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  adresse_physique?: string | null;
  pays_residance?: string | null;
  ville_residance?: string | null;
  num_piece_identite?: string | null;
  createdAt: string;
  roles: {
    id: number;
    role: string;
    description: string;
    HasRoles: {
      id: number;
      UserId: number;
      RoleId: number;
      status: number;
      createdAt: string;
      updatedAt: string;
    };
  }[];
};

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data, isLoading, isError } = useGetUserProfileQuery();
  const [preview, setPreview] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserDataProps | null>(null);

  // Vérifier et mettre à jour les données utilisateur quand elles sont chargées
  useEffect(() => {
    if (data) {
      // console.log("Structure complète des données:", JSON.stringify(data));
      setUserData(data.data);
    }
  }, [data]);

  if (isLoading || isError || !userData) {
    // return null;
    // if (isError) return null;
    // if (!userData) return null;
    // console.log(userData);
  }

  return (
    <SidebarMenu className="border rounded-md hover:cursor-pointer">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userData?.avatar || ""} alt={userData?.fs_name} />
                <AvatarFallback className="rounded-lg">
                  {userData?.fs_name[0]}
                  {userData?.ls_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userData?.nick_name}</span>
                <span className="truncate text-xs">{userData?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userData?.avatar || ""} alt={userData?.fs_name} />
                  <AvatarFallback className="rounded-lg">
                    {userData?.fs_name[0]}
                    {userData?.ls_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userData?.nick_name}</span>
                  <span className="truncate text-xs">{userData?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem> */}
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
