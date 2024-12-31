"use client"
import { useState } from "react"
import { AddMedicineModal } from "./addMedicineModal"

import { Button } from "@/components/ui/button"
import { AddTestModal } from "./addTestModal"

type type= "Medicne" | "Test" 

export function ProductsHeader({type}:{type:type}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  return (
    
    <div className="flex items-center justify-between p-2">

    <h1 className="text-3xl font-bold">{`${type}s Management`}</h1>
   
    <Button className="w-full sm:w-auto" onClick={() => setIsAddModalOpen(true)}>
    Add New {type}
  </Button>
  {type==="Medicne"?
  <AddMedicineModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
:  <AddTestModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
  }
  </div>
  )
}

