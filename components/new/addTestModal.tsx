"use client"

import { useState} from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {  AddTest } from "@/lib/admin/clientApi"
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';
import Spinner from "../Spinner"


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})

export function AddTestModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setIsLoading(true);
    const res= await AddTest(values);
    if(res.success){  
      toast.success(res.message,{
        duration: 2000,
        position: 'bottom-center',
      });
      form.reset({   name: ""})
      onClose()
      router.refresh();
    }
    else {
      res.error.forEach((err:string) => toast.error(err.msg || err || 'An unexpected error occurred.',{
        duration: 2000,
        position: 'bottom-center',
      }))
    }
    setIsLoading(false);

    // Here you would typically send the data to your backend
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Test</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           
           <Button type="submit">{isLoading?<Spinner />:"Submit"}</Button>
          </form>
        </Form>
      </DialogContent>
      <Toaster />
    </Dialog>
  )
}

