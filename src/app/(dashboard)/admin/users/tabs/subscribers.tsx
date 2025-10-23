import { useListSubscribersQuery } from "@/lib/apis/admin/user-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/shared/loading";
import { Skeleton } from "@/components/ui/skeleton";

interface SubscribersTabProps {
  title: string;
  description: string;
}

export default function SubscribersTab({ title, description }: SubscribersTabProps) {
  const {
    data: subscribersData,
    isLoading: isSubscribersLoading,
    isError: isSubscribersError,
    refetch: refetchSubscribers,
  } = useListSubscribersQuery();

  const subscribers = subscribersData?.data.list ?? [];

  if (isSubscribersLoading) {
    return (
      <div className="bg-white border flex flex-col rounded-md gap-10 p-5 md:p-10">
        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <Skeleton className="h-10 w-32 mb-4" />
            <Table>
              <TableHeader className="border">
                <TableRow>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border">
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border flex flex-col rounded-md gap-10 p-5 md:p-10">
      <div className="flex flex-col gap-2.5">
        <h3 className="text-[#0466C8] text-xl font-semibold">{title}</h3>
        <p className="text-[#33415C] font-medium">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {isSubscribersError ? (
            <div className="text-center py-10 text-red-500">
              Impossible de charger les abonnés. Veuillez réessayer plus tard.
            </div>
          ) : subscribers.length > 0 ? (
            <>
              <Button
                className="mb-4"
                onClick={() => {
                  const csvContent =
                    "data:text/csv;charset=utf-8," +
                    subscribers.map((sub) => sub.user_email).join(";");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "abonnees.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Télécharger CSV
              </Button>
              <Table>
                <TableCaption>Liste des abonnés</TableCaption>
                <TableHeader className="border">
                  <TableRow>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border">
                  {subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>{subscriber.user_email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">Aucun abonné trouvé</div>
          )}
        </div>
      </div>
    </div>
  );
}
