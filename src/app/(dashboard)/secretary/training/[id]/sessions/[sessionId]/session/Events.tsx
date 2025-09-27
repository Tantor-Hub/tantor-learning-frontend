"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useGetEventsBySessionQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} from "@/lib/apis/event-api";
import { Event, CreateEventRequest, UpdateEventRequest } from "@/types/event";
import { EventEditor } from "@/components/event/EventEditor";
import { EventItem } from "@/components/event/EventItem";

export default function Events() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [eventEditorOpen, setEventEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useGetEventsBySessionQuery({ sessionId });

  const [createEvent, { isLoading: creating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: updating }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: deleting }] = useDeleteEventMutation();

  const events = eventsData?.data || [];

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setEventEditorOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventEditorOpen(true);
  };

  const handleSaveEvent = async (data: CreateEventRequest | UpdateEventRequest) => {
    try {
      if (editingEvent) {
        // Update existing event
        await updateEvent(data as UpdateEventRequest).unwrap();
        toast.success("Event updated successfully!");
      } else {
        // Create new event
        await createEvent(data as CreateEventRequest).unwrap();
        toast.success("Event created successfully!");
      }
      setEventEditorOpen(false);
      setEditingEvent(null);
    } catch (error: any) {
      console.error("Error saving event:", error);

      // Show detailed error information
      if (error?.data?.message) {
        toast.error(`Error: ${error.data.message}`);
      } else if (error?.data?.error) {
        toast.error(`Error: ${error.data.error}`);
      } else if (error?.status === 404) {
        toast.error("API endpoint not found. Please check the server configuration.");
      } else if (error?.status === 400) {
        toast.error("Invalid data provided. Please check all required fields.");
      } else if (error?.status === 401) {
        toast.error("Authentication required. Please log in again.");
      } else if (error?.status === 403) {
        toast.error("Access denied. You do not have permission to manage events.");
      } else {
        toast.error(`Failed to save event: ${error?.message || "Unknown error"}`);
      }
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent({ id: eventId }).unwrap();
      toast.success("Event deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting event:", error);

      if (error?.data?.message) {
        toast.error(`Error: ${error.data.message}`);
      } else if (error?.data?.error) {
        toast.error(`Error: ${error.data.error}`);
      } else if (error?.status === 404) {
        toast.error("Event not found or already deleted.");
      } else if (error?.status === 401) {
        toast.error("Authentication required. Please log in again.");
      } else if (error?.status === 403) {
        toast.error("Access denied. You do not have permission to delete events.");
      } else {
        toast.error(`Failed to delete event: ${error?.message || "Unknown error"}`);
      }
    }
  };

  const handleCancel = () => {
    setEditingEvent(null);
    setEventEditorOpen(false);
  };

  const handleRefresh = () => {
    refetchEvents();
    toast.success("Events refreshed!");
  };

  if (eventsLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (eventsError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Session Events</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button onClick={handleCreateEvent} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Failed to load events</p>
                <p className="text-sm text-red-500">Failed to load events. Please try again.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Session Events</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={eventsLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${eventsLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={handleCreateEvent} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Plus className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No events scheduled</h4>
              <p className="text-gray-500 mb-4">Create your first event to get started</p>
              <Button onClick={handleCreateEvent}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Event
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((event: Event) => (
            <EventItem
              key={event.id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              isDeleting={deleting}
            />
          ))}
        </div>
      )}

      {/* Event Editor Modal */}
      <EventEditor
        open={eventEditorOpen}
        onOpenChange={setEventEditorOpen}
        initialEvent={editingEvent || undefined}
        sessionId={sessionId}
        onSave={handleSaveEvent}
        onCancel={handleCancel}
        isLoading={creating || updating}
      />
    </div>
  );
}
