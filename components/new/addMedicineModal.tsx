"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormDataHandler, ImageHandler } from "@/utils/AuthHandlers"
import { AddMedicine } from "@/lib/admin/clientApi"
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';
import Spinner from "../Spinner"

const categories= [
      "Cosmetics",
      "Hair Care",
      "Every Day Essentials",
      "Medical Equipment & Supplies",
      "Mom & Baby",
      "Sexual Health",
      "Medicine",
      "Skin Care",
    ]

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  photo: z.custom<File>(ImageHandler, {
      message: 'Invalid image file. Must be JPEG, PNG, or GIF and less than 5MB.',
    }),
  cost: z.number().min(1, {
    message: "Cost must be a positive number.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
})

export function AddMedicineModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      photo: undefined,
      cost: 0,
      category: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setIsLoading(true);
    const formData=FormDataHandler(values);
    const res= await AddMedicine(formData);
    if(res.success){  
      toast.success(res.message,{
        duration: 2000,
        position: 'bottom-center',
      });
      form.reset({   name: "",
            photo: undefined,
            cost: 0,
            category: "",})
            setPhotoPreview(null)
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Medicine</DialogTitle>
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
            <FormField
              control={form.control}
              name="photo"
              render={({ field: {  onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          handleFileChange(e)
                          onChange(e.target.files?.[0])
                        }}
                        
                        {...field}
                      />
                      
                    </div>
                  </FormControl>
                  {photoPreview && (
                    <div className="mt-4">
                      <Image
                        src={photoPreview}
                        alt="Photo preview"
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100" {...field} onChange={e => field.onChange(+e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {categories.map((category,index)=>(

                      <SelectItem key={index} value={category}>{category}</SelectItem>
                        ))}
                
                    </SelectContent>
                  </Select>
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

