import ProtectedRoute from "@/components/ProtectedRoute"
import BlurFade from '@/components/ui/blur-fade'
import { ActorsHeader } from '@/components/new/actors-header'
import {  getAllPatientsData } from '@/lib/api'
import { StatisticsCards } from '@/components/new/statistics-cards'
import { ActorsTable } from '@/components/new/actors-table'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SearchBar from '@/components/ui/SearchBar'


async function PatientsStats() {
    
  const  {data:allPatients} = await getAllPatientsData(500000,1)
  return (
    <StatisticsCards stats={[
      {title:"Total Patients",icon:"Users",value:allPatients.data.length,paragragph:(<p className="text-xs text-muted-foreground">On The App</p>)},
      // {title:"Approved Labs",icon:"UserCheck",value:allLabs.data.filter((d) => d.state === true).length,paragragph:(<p className="text-xs text-muted-foreground">On The App</p>)},
      // {title:"Pending Labs",icon:"UserPlus",value:allLabs.data.filter((d) => d.state === false).length,paragragph:(<p className="text-xs text-muted-foreground">On The App</p>)},
      // {title:"Total Reservations",icon:"UserPlus",value:allReservations.data.length,paragragph:(<p className="text-xs text-muted-foreground">On The App</p>)},
  
  
  
  
  ]} />


  )
}
async function PatientsData({ page }: { page: number }) {
    
  const {data:patients} = await getAllPatientsData(5,page)
  return (
 

   <ActorsTable
   currentPage={page}
   totalPages={patients.paginationResult.numberOfPages}
   Actors={patients.data}
   role='Patient'
   state=''
   />
  )
}

export default function Page({ searchParams }: { searchParams: { page?: string  } }) {
  const page = Number(searchParams.page) || 1;

  
  return (
    <ProtectedRoute allowedRoles={['admin']}>


      <main className="flex flex-1 flex-col gap-2 p-5 sm:gap-4 sm:p-4 md:gap-8 md:p-8 ">
      <BlurFade delay={0} className='space-y-6' inView>
      <ActorsHeader role='Patient' />
      <PatientsStats />
      <Card>
      <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center  mb-4 p-4 sm:p-0">
        <CardTitle>Patients</CardTitle>
            <SearchBar />
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
           
            <PatientsData page={page} />
      </CardContent>
     
    </Card>
      </BlurFade>
      </main>
    </ProtectedRoute>
  )
}