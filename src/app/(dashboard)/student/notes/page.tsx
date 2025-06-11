import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { filters } from "../courses/data";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { gradesData } from "./data";
import { Card, CardContent } from "@/components/ui/card";

const StudentNotes = () => {
  return (
    <section>
      <div className="flex flex-col sm:flex-row gap-5 md:gap-10 mb-4">
        <div className="flex items-center border px-2.5 w-full rounded-md bg-white">
          <Image src="/icons/search.svg" height={20} width={20} alt="search icon" />
          <Input
            type="search"
            className="text-[#ACACAC] border-none focus-visible:outline-none focus-visible:ring-0"
            placeholder="Rechercher Un cours ..."
          />
        </div>
        <div className="flex gap-2 items-center border px-2.5 py-1.5 min-w-28 rounded-md bg-white">
          <Image src="/icons/filter.svg" height={20} width={20} alt="filter ico" />
          <span className="text-[#ACACAC]">Filtres</span>
        </div>
      </div>
      <div className="border p-5 md:p-8 flex flex-col items-end gap-7 bg-white mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-10 w-full">
          {filters.map(
            (filter, i) =>
              ["Notes", "Cours", "Formations"].includes(filter.label) && (
                <div key={i} className="flex flex-col gap-[7px]">
                  <span className=" font-medium">{filter.label}</span>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={filter.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="most-recent">{filter.value}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )
          )}
        </div>
        <Button className="bg-transparent border border-[#cbd9e7] text-[#ACACAC]">
          <Image src="/icons/close.svg" height={20} width={20} alt="close icon" />
          Renitialiser les filtres
        </Button>
      </div>
      <div className="bg-white p-5 md:p-8 flex flex-col space-y-5">
        <div className=" font-medium flexflex-col space-y-3.5">
          <h1 className="text-[#0466C8] text-3xl">Mes notes</h1>
          <p className="text-sm">
            Moyenne Generale : <span className="text-[#0466C8]">15,85/20</span>
          </p>
          <p className="text-sm">
            Moyenne Generale en pourcentage :{" "}
            <span className="text-[#0466C8]">{((15.85 / 20) * 100).toFixed(1) + "%"}</span>
          </p>
        </div>
        <div className=" font-medium flexflex-col space-y-3.5">
          <h1 className="text-[#0466C8] text-3xl">Apperciation generale</h1>
          <p className="text-sm max-w-[750px]">
            L’apprenant comprends les matieres facilement et est assidue au travail. Neamoins il
            devra ameliorer son apport dans l’oral et intervenir plus dans les echanges oraux en
            cours.
          </p>
          <p className="text-sm mb-10">Mention :</p>
          <span className="px-4 py-2 bg-[#E7F5EC] rounded-full text-sm text-[#0F973D] border border-[#048317]">
            Très bien
          </span>
        </div>
        <div className="flex flex-col gap-6">
          {gradesData.map((subject, idx) => (
            <div key={idx} className="shadow-md rounded-md">
              <div className="p-6 font-medium">
                <div className="flex flex-col gap-5 md:flex-row justify-between mb-4">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-base md:text-xl font-semibold text-[#0466C8]">
                      {subject.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">{subject.instructor}</p>
                  </div>
                  <div className="text-sm text-muted-foreground gap-2 flex flex-col md:items-end">
                    <span className="text-black">{subject.finalGrade}</span>
                    <span>Moyenne de la classe : {subject.average}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div className="min-w-[1000px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="grid grid-cols-5 pt-5 px-2.5 w-full bg-[#ECECEC] rounded-md shadow-sm">
                          <TableHead className="col-span-2">Évaluation</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead>Coefficient</TableHead>
                          <TableHead>Note pondérée</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subject.notes.map((note, noteIdx) => (
                          <TableRow
                            key={noteIdx}
                            className="grid grid-cols-5 w-full p-2.5 rounded-md shadow-sm"
                          >
                            <TableCell className="col-span-2">{note.evaluation}</TableCell>
                            <TableCell>{note.notes}</TableCell>
                            <TableCell>{note.coefficient}</TableCell>
                            <TableCell>{note.notePonderee}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="mt-6 text-sm flex flex-col sm:flex-row gap-5 text-muted-foreground">
                  <span className="h-full text-[#0466C8] border border-[#0466C8] rounded-[4px] shadow-sm min-w-fit p-2.5">
                    Appreciation :
                  </span>
                  <p className="text-xs md:text-sm text-center">{subject.appreciation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default StudentNotes;
