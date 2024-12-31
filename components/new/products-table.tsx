"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import SearchBar from "../ui/SearchBar"
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import {  AcceptProduct, DeclineProduct, SearchProducts } from "@/lib/admin/clientApi"
import Pagination from "../Pagination"
import { ProductModal } from "./product-modal"
import Spinner from "../Spinner"

type type= "Medicine" | "Test" 


interface IProduct {
  id:string
  name: string
  category: string
  user: string
  photo?: string
  state: boolean
  cost?: number
}

interface IProps{
  type: type
  Products: IProduct[]
  currentPage:number
  totalPages:number
  state:string
}
interface IProductData extends IProps{
  selectedProduct:IProduct
  setSelectedProuct:(data:IProduct|null)=>void
  handlePageChange:(newPage:number)=>void
  handleAccept:()=>void
  handleDecline:()=>void

}
const ProductsData=({Products,selectedProduct,setSelectedProuct,handlePageChange,handleAccept,handleDecline,currentPage,totalPages,type}:IProductData)=>{
  return (
    <div className="overflow-x-auto">
      {Products.length<=0?<div className="flex justify-center items-center">{`No ${type}s`}</div>:(
        <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40%]">Name</TableHead>
          <TableHead className="hidden sm:table-cell w-[40%]">{type==="Medicine"? "Category":"User Email"}</TableHead>
          <TableHead className="text-right w-[20%]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell className="hidden sm:table-cell">{type==="Medicine"?product.category:product.user}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" onClick={() => setSelectedProuct(product)}>
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <Toaster />
    </Table>
    {selectedProduct && (
    <ProductModal type={type} product={selectedProduct} onClose={() => setSelectedProuct(null)} onAccept={handleAccept} onDecline={handleDecline} />
  )}
      <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange}/>
      </>
)}
      </div>
  )
}

export function ProductsTable({Products,currentPage,totalPages,type,state}:IProps) {
  const [selectedProduct, setSelectedProuct] = useState<IProduct|null>(null)
const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')

    const [SearchResult, setSearchResult] = useState<{currentPage:number,totalPages:number,data:IProduct[]}|null>(null)



  const handleSearch = async (page:number) => {
    setIsLoading(true);
    if (!searchTerm) {
      setSearchResult(null)
      setIsLoading(false);
      return
    }

    try {
      
      const res = await SearchProducts(searchTerm, 7, page,`${type.toLowerCase()}s`,state)
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
  // const filteredproducts = products.filter((product) =>
  //   product.name.toLowerCase().includes(searchTerm.toLowerCase())
  // )

  const handlePageChange=(newPage:number)=>{
    if(type==="Medicine"){

      router.push(`medicines?page=${newPage}`);
    }
    else   if(type==="Test"){

      router.push(`tests?page=${newPage}`);
    }
  }

  const handleAccept=async()=>{
    const res = await AcceptProduct({id:selectedProduct.id,type:type.toLowerCase()})
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
    setSelectedProuct(null);
  }
  

  const handleDecline=async()=>{
    const res = await DeclineProduct({id:selectedProduct.id,type:type.toLowerCase()})
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
    setSelectedProuct(null);
  }
  


  return (

    <div className="flex flex-col space-y-2">
  <div className="flex w-full justify-center sm:justify-end">

<SearchBar onSearch={handleSearch} setResult={setSearchResult} searchTerm={searchTerm} setSearchTerm={setSearchTerm} title={`Search for ${type}`}/>
  </div>

{    isLoading ? (
      <div className="flex justify-center items-center p-8">
        <Spinner />
      </div>
    ) : (
      SearchResult === null ? (
        <ProductsData 
     Products={Products}
     currentPage={currentPage}
     totalPages={totalPages}
     handleAccept={handleAccept}
     handleDecline={handleDecline}
     handlePageChange={handlePageChange}
     type={type}
setSelectedProuct={setSelectedProuct}
     selectedProduct={selectedProduct}
     state={state}
        />
      ) : (
        <ProductsData 
        Products={SearchResult.data}
        currentPage={SearchResult.currentPage}
        totalPages={SearchResult.totalPages}
        handleAccept={handleAccept}
        handleDecline={handleDecline}
        handlePageChange={handlePageChange}
     type={type}
     setSelectedProuct={setSelectedProuct}
     selectedProduct={selectedProduct}
        state={state}
        />
      )
    )
  }
</div>
    )
}



