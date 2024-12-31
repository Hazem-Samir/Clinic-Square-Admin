 "use client"
import Image from "next/image"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { shortName } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { Button } from "@/components/ui/button"
interface IProduct {
  id:string
  name: string
  category: string
  user: string
  photo?: string
  state: boolean
  cost?: number
}
type type= "Medicine" | "Test" 

export function ProductModal({ product, onClose, onAccept, onDecline,type }: { product: IProduct, onClose: () => void, onAccept: () => void, onDecline: () => void,type:type }) {
  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[425px] ${type==="Medicine" ? "h-[80vh]":null} p-0 flex flex-col`}>
        <DialogHeader className="px-6 py-4 ">
          <DialogTitle>product Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 py-4">
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={product.photo} alt={product.name} />
                <AvatarFallback>{shortName(product.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* <div>
                <p className="text-sm font-medium mb-2">Address</p>
                {product.address.map((address, index) => (
                  <p key={index} className="text-sm text-gray-500 mb-1">{address}</p>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Phone</p>
                {product.phoneNumbers.map((phone, index) => (
                  <p key={index} className="text-sm text-gray-500 mb-1">{phone}</p>
                ))}
              </div> */}
              
              {product.cost?
              <div>
                <p className="text-sm font-medium mb-1">Cost</p>
                <p className="text-sm text-gray-500">{product.cost}</p>
              </div>
              :null}
              <div>
                <p className="text-sm font-medium mb-1">User Email</p>
                <p className="text-sm text-gray-500">{product.user}</p>
              </div>
              
             
            </div>
            {product.photo?
            <div>
              <p className="text-sm font-medium mb-2">Photo</p>
              <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                <div className="flex p-4">
                 
                    <Image
                      width={500}
                      height={500}
                      src={product.photo}
                      alt={'Product Photo'}
                      className="h-100 w-100 rounded object-contain mr-4 last:mr-0"
                      quality={100}
                    />
            </div>
              
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
:null}
            <DialogFooter className="flex flex-col sm:flex-row gap-2 items-center mb-2 justify-center">
              {!product.state?
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

