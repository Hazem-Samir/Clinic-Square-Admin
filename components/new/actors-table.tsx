"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DoctorModal } from "@/components/new/doctor-modal"
import SearchBar from "../ui/SearchBar"
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import {  AcceptActor, DeclineActor, searchActors, searchPatients } from "@/lib/admin/clientApi"
import Pagination from "../Pagination"
import Spinner from "../Spinner"



interface IDoctor {
  id:string
  name: string
  dateOfBirth: string
  email: string
  address: string[]
  phoneNumbers: string[]
  specialization: string
  profilePic: string
  state?: boolean 
  about: string
  license: string[]
  gender: string
}
type role= "Patient" | "Pharmacy" | "Lab" | "Doctor" 
interface IProps{
  Actors: IDoctor[]
  currentPage:number
  totalPages:number
  role: role
  state:string
}
interface IActorData extends IProps{
  selectedActor:IDoctor
  setSelecetdActor:(data:IDoctor|null)=>void
  handlePageChange:(newPage:number)=>void
  handleAccept:()=>void
  handleDecline:()=>void

}
const ActorData=({currentPage,totalPages,Actors,role,selectedActor,setSelecetdActor,handlePageChange,handleAccept,handleDecline}:IActorData)=>{
  return(
    <div className="overflow-x-auto">
      {Actors.length<=0?<div className="flex justify-center items-center">{`No ${role}s`}</div>:(
        <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40%]">Name</TableHead>
          <TableHead className="hidden sm:table-cell w-[40%]">Email</TableHead>
          <TableHead className="text-right w-[20%]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Actors.map((actor) => (
          <TableRow key={actor.id}>
            <TableCell className="font-medium">Dr. {actor.name}</TableCell>
            <TableCell className="hidden sm:table-cell">{actor.email}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" onClick={() => setSelecetdActor(actor)}>
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <Toaster />
    </Table>
    {selectedActor && (
    <DoctorModal role={role} doctor={selectedActor} onClose={() => setSelecetdActor(null)} onAccept={handleAccept} onDecline={handleDecline} />
)}
    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange}/>
    </> 
      )}
  </div>
  )
}
export function ActorsTable({currentPage,totalPages,Actors,role,state}:IProps) {
  const [selectedActor, setSelecetdActor] = useState<IDoctor|null>(null)
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')

    const [SearchResult, setSearchResult] = useState<{currentPage:number,totalPages:number,data:IDoctor[]}|null>(null)



  const handleSearch = async (page:number) => {
    setIsLoading(true);
    if (!searchTerm) {
      setSearchResult(null)
      setIsLoading(false);
      return
    }

    try {
      let res;
      if(role==="Patient"){

        res = await searchPatients(searchTerm, 7, page)
      }
      else{

        res = await searchActors(searchTerm, 7, page,state,`${role.toLowerCase()}`)
      }
      if (res.success === true) {
        console.log(res.data)
        setSearchResult({
          data: res.data.data,
          totalPages: res.data.paginationResult.numberOfPages,
          currentPage: res.data.paginationResult.currentPage
        })
      } else {
        res.message.forEach((err: string) => 
          toast.error(err || 'An unexpected error occurred.', {
            duration: 2000,
            position: 'bottom-center',
          })
        )
      }
    } catch (error) {
      console.error(error)
      toast.error('An unexpected error occurred.')
    } finally {
      setIsLoading(false);
    }
  }

  // const filteredDoctors = Doctors.filter((doctor) =>
  //   actor.name.toLowerCase().includes(searchTerm.toLowerCase())
  // )
  const handlePageChange=(newPage:number)=>{
    if(Actors.length>0){
      if(Actors[0].state===undefined){

        router.push(`${role.toLowerCase()}s?page=${newPage}`);
      }
      else if(Actors[0].state){

        router.push(`${role.toLowerCase()}s?Apage=${newPage}`);
      }
      else {
        router.push(`${role.toLowerCase()}s?Ppage=${newPage}`);

      }
    }
  }

  const handleAccept=async()=>{
    const res = await AcceptActor({id:selectedActor.id})
    if (res.success === true) {
      toast.success(res.message, {
        duration: 2000,
        position: 'top-center',
      });
      router.refresh();
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }));
    }
    setSelecetdActor(null);
  }
  

  const handleDecline=async()=>{
    const res = await DeclineActor({id:selectedActor.id})
    if (res.success === true) {
      toast.success(res.message, {
        duration: 2000,
        position: 'top-center',
      });
      router.refresh();
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }));
    }
    setSelecetdActor(null);
  }
  



  return (
<div className="flex flex-col space-y-2">
  <div className="flex w-full justify-center sm:justify-end">

<SearchBar onSearch={handleSearch} setResult={setSearchResult} searchTerm={searchTerm} setSearchTerm={setSearchTerm} title={`Search for ${role}`}/>
  </div>

{    isLoading ? (
      <div className="flex justify-center items-center p-8">
        <Spinner />
      </div>
    ) : (
      SearchResult === null ? (
        <ActorData 
     Actors={Actors}
     currentPage={currentPage}
     totalPages={totalPages}
     handleAccept={handleAccept}
     handleDecline={handleDecline}
     handlePageChange={handlePageChange}
     role={role}
     selectedActor={selectedActor}
     setSelecetdActor={setSelecetdActor}
     state={state}
        />
      ) : (
        <ActorData 
        Actors={SearchResult.data}
        currentPage={SearchResult.currentPage}
        totalPages={SearchResult.totalPages}
        handleAccept={handleAccept}
        handleDecline={handleDecline}
        handlePageChange={handlePageChange}
        role={role}
        selectedActor={selectedActor}
        setSelecetdActor={setSelecetdActor}
        state={state}
        />
      )
    )
  }
</div>

  )
}

