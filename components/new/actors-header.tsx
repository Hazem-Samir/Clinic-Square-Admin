type role= "Patient" | "Pharmacie" | "Lab" | "Doctor" 

export function ActorsHeader({role}:{role:role}) {
  return (
    <div className="flex items-center justify-between p-2">

      <h1 className="text-3xl font-bold">{`${role}s Management`}</h1>
     
    </div>
  )
}

