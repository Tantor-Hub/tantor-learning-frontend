"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ParticipationInfo } from "@/types/events";
import { Users, UserCheck, UserX } from "lucide-react";

interface ParticipationInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participationInfo: ParticipationInfo | undefined;
  isLoading: boolean;
  eventTitle: string;
}

export function ParticipationInfoModal({
  open,
  onOpenChange,
  participationInfo,
  isLoading,
  eventTitle,
}: ParticipationInfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Informations de participation - {eventTitle}
          </DialogTitle>
          <DialogDescription>
            Liste des participants et leurs statuts de participation
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : participationInfo ? (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {participationInfo.totalInSession}
                </div>
                <div className="text-sm text-gray-600">Total en session</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {participationInfo.participantsCount}
                </div>
                <div className="text-sm text-gray-600">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {participationInfo.totalInSession - participationInfo.participantsCount}
                </div>
                <div className="text-sm text-gray-600">Non participants</div>
              </div>
            </div>

            {/* Participants Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Avatar</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead className="text-center">Participation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participationInfo.students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        Aucun étudiant dans cette session
                      </TableCell>
                    </TableRow>
                  ) : (
                    participationInfo.students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={student.avatar}
                              alt={`${student.firstName} ${student.lastName}`}
                            />
                            <AvatarFallback>
                              {student.firstName?.[0]?.toUpperCase()}
                              {student.lastName?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{student.lastName}</TableCell>
                        <TableCell>{student.firstName}</TableCell>
                        <TableCell className="text-center">
                          {student.participated ? (
                            <Badge variant="default" className="bg-green-600">
                              <UserCheck className="w-3 h-3 mr-1" />
                              Participé
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <UserX className="w-3 h-3 mr-1" />
                              Non participé
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucune information de participation disponible
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
