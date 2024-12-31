 "use client"
import Image from "next/image"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { shortName } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { Button } from "@/components/ui/button"
import { getAge } from "@/utils/utils"
type role= "Patient" | "Pharmacy" | "Lab" | "Doctor" 

interface IDoctor {
  id:string
  name: string
  dateOfBirth: string
  email: string
  address: string[]
  phoneNumbers: string[]
  specialization: string
  profilePic: string
  state: boolean|undefined
  about: string
  license: string[]
  gender: string
}

export function DoctorModal({ doctor, onClose, onAccept, onDecline,role }: { doctor: IDoctor, onClose: () => void, onAccept: () => void, onDecline: () => void,role:role }) {
  return (
    <Dialog open={!!doctor} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[425px] ${role!=="Patient"?"h-[80vh]":null} p-0 flex flex-col`}>
        <DialogHeader className="px-6 py-4 ">
          <DialogTitle>Doctor Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 py-4">
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={doctor.profilePic} alt={doctor.name} />
                <AvatarFallback>{shortName(doctor.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold">{doctor.name}</h3>
                <p className="text-sm text-gray-500">{doctor.specialization}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Address</p>
                {doctor.address.map((address, index) => (
                  <p key={index} className="text-sm text-gray-500 mb-1">{address}</p>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Phone</p>
                {doctor.phoneNumbers.map((phone, index) => (
                  <p key={index} className="text-sm text-gray-500 mb-1">{phone}</p>
                ))}
              </div>
              {doctor.gender?
              <div>
                <p className="text-sm font-medium mb-1">Gender</p>
                <p className="text-sm text-gray-500">{doctor.gender}</p>
              </div>
              :null}
               {doctor.dateOfBirth?
              <div>
                <p className="text-sm font-medium mb-1">Age</p>
                <p className="text-sm text-gray-500">{getAge(doctor.dateOfBirth)}</p>
              </div>
:null}
            </div>
            {doctor.license?
            <div>
              <p className="text-sm font-medium mb-2">License</p>
              <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                <div className="flex p-4">
                  {doctor.license.map((license, index) => (
                    <Image
                      width={500}
                      height={500}
                      key={index}
                      src={license}
                      alt={`License ${index + 1}`}
                      className="h-100 w-100 rounded object-contain mr-4 last:mr-0"
                      quality={100}
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
:null}
            <DialogFooter className="flex flex-col sm:flex-row gap-2 items-center mb-2 justify-center">
              {doctor.state!==undefined && !doctor.state?
              <>
                <Button type="button"  variant="destructive" className="w-full sm:w-auto text-xs sm:text-sm" onClick={onDecline}>
                  Decline
                </Button>
                <Button type="button" className="w-full sm:w-auto text-xs sm:text-sm " onClick={onAccept}>
                  Accept
                </Button>
                </>
:null}
              </DialogFooter>
          </div>
        
        </ScrollArea>
        
      </DialogContent>
    </Dialog>
  )
}
