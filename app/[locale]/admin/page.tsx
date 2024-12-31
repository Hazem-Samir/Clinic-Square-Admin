import ProtectedRoute from "@/components/ProtectedRoute"
import BlurFade from '@/components/ui/blur-fade'
import { DashboardCharts } from '@/components/new/dashboard-charts'
import { getAllActorData, getAllActorStats, getAllOrdersStats, getAllPatientsData, getAllReservationsStats, getPatientStats } from '@/lib/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
async function PatientsStatData() {
  const [ {data:pendingActors},{data:allReservations},{data:stat}] = await Promise.all([
    getAllPatientsData(500000,1),
    getAllReservationsStats(50000,1,"doctor"),
     getPatientStats(500000,1)
  ])
  

const Actors = monthNames.map((key, index) => {
  const found = stat.data.find(st => st._id.month === `${index + 1}` );
  return {
      key,
      actors: found ? found.count : 0
  };
});
const Reservations = monthNames.map((key, index) => {
  const found = allReservations.data.find(st => st._id.month === `${index + 1}`);
  return {
      key,
      reservations: found ? found.count : 0
  };
});
  return (

  <DashboardCharts chartsData={[Actors,Reservations,[{pendingActors:pendingActors.data.length}]]} titles={['Patients',"All Reservations"]} descriptions={['January - December 2024','January - December 2024',["All Patients","Patients"]]} role='Patient'/>

  )
}


async function LabsStatData() {
  const [ {data:pendingActors},{data:allReservations},{data:stat}] = await Promise.all([
    getAllActorData(500000,1,"lab","false"),
    getAllReservationsStats(50000,1,"lab"),
     getAllActorStats(500000,1,"lab")
  ])
  

const Actors = monthNames.map((key, index) => {
  const found = stat.data.find(st => st._id.month === `${index + 1}` && st._id.state === true);
  return {
      key,
      actors: found ? found.count : 0
  };
});
const Reservations = monthNames.map((key, index) => {
  const found = allReservations.data.find(st => st._id.month === `${index + 1}`);
  return {
      key,
      reservations: found ? found.count : 0
  };
});
  return (

  <DashboardCharts chartsData={[Actors,Reservations,[{pendingActors:pendingActors.data.length}]]} titles={['Labs',"All Reservations"]} descriptions={['January - December 2024','January - December 2024',["The Pending Labs","Labs"]]} role='Lab'/>

  )
}

async function DoctorsStatData() {
  const [ {data:pendingActors},{data:allReservations},{data:stat}] = await Promise.all([
    getAllActorData(500000,1,"doctor","false"),
    getAllReservationsStats(50000,1,"doctor"),
     getAllActorStats(500000,1,"doctor")
  ])
  

const Actors = monthNames.map((key, index) => {
  const found = stat.data.find(st => st._id.month === `${index + 1}` && st._id.state === true);
  return {
      key,
      actors: found ? found.count : 0
  };
});
const Reservations = monthNames.map((key, index) => {
  const found = allReservations.data.find(st => st._id.month === `${index + 1}`);
  return {
      key,
      reservations: found ? found.count : 0
  };
});
  return (

  <DashboardCharts chartsData={[Actors,Reservations,[{pendingActors:pendingActors.data.length,}]]} titles={['Doctors',"All Reservations"]} descriptions={['January - December 2024','January - December 2024',["The Pending Doctors","Doctors"]]} role='Doctor'/>

  )
}


async function PharmaciesStatData() {
  const [ {data:pendingActors},{data:allReservations},{data:stat}] = await Promise.all([
    getAllActorData(500000,1,"pharmacy","false"),
    getAllOrdersStats(50000,1),
     getAllActorStats(500000,1,"pharmacy")
  ])
  

const Actors = monthNames.map((key, index) => {
  const found = stat.data.find(st => st._id.month === `${index + 1}` && st._id.state === true);
  return {
      key,
      actors: found ? found.count : 0
  };
});
const Reservations = monthNames.map((key, index) => {
  const found = allReservations.data.find(st => st._id.month === `${index + 1}`);
  return {
      key,
      reservations: found ? found.count : 0
  };
});
  return (

  <DashboardCharts chartsData={[Actors,Reservations,[{pendingActors:pendingActors.data.length,}]]} titles={['Pharmacies',"All Orders"]} descriptions={['January - December 2024','January - December 2024',["The Pending Pharmacies","Pharmacies"]]} role='Pharmacie'/>

  )
}



export default function HomePage() {
 
  return (
    <ProtectedRoute allowedRoles={['admin']}>  
     
     <main className="flex flex-1 flex-col gap-2 p-5 sm:gap-4 sm:p-4 md:gap-8 md:p-8 ">
      <BlurFade delay={0} className='space-y-6' inView>
 
        <Tabs defaultValue="Patients" className="w-full">
        <div className="flex flex-col sm:flex-row justify-center items-center  mb-6 sm:mb-4 p-4 sm:p-0">

            <TabsList className="grid  grid-cols-1 md:grid-cols-4 md:mb-5 mb-24 md:space-y-0 space-y-2 md:bg-muted bg-transparent mr-0">
              <TabsTrigger value="Patients">Patients</TabsTrigger>
              <TabsTrigger value="Doctors">Doctors</TabsTrigger>
              <TabsTrigger value="Labs">Labs</TabsTrigger>
              <TabsTrigger value="Pharmacies">Pharmacies</TabsTrigger>
            </TabsList>
            </div>
            {/* <Input
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-sm"
              /> */}
          <TabsContent value="Doctors" >
           <DoctorsStatData />
          </TabsContent>
          <TabsContent value="Patients">
          <PatientsStatData />
          </TabsContent>
          <TabsContent value="Labs">
           <LabsStatData />
          </TabsContent>
          <TabsContent value="Pharmacies">
          <PharmaciesStatData />
          </TabsContent>
        </Tabs>
 
        {/* <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <pharmaciesData page={page} />
        </Suspense>  */}
      </BlurFade>
      </main>
    </ProtectedRoute>
  )
}