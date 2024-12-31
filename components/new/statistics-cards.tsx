import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserPlus, DollarSign ,DoorOpen} from 'lucide-react'
import {ReactNode} from "react";
import NumberTicker from "../ui/number-ticker";

interface IStat{
   title: string
    value: number
    icon: string
    paragragph?:ReactNode
}

interface IProps{
  stats:IStat[]
}


const iconMap = {
  Users, UserCheck, UserPlus, DollarSign,DoorOpen
};
export function StatisticsCards({stats}:IProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap];
        return(
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <Icon className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value>0 ?<NumberTicker value={stat.value} /> :stat.value}</div>
            {stat.paragragph}
          </CardContent>
        </Card>
      )})}
    </div>
  )
}

