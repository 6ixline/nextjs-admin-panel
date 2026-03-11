import React from 'react'
import { format } from 'date-fns'

type Props = {
  isoDate: string
}

export default function FormattedDate({ isoDate }: Props) {
  const date = new Date(isoDate)
  const formattedDate = format(date, "MMMM do, yyyy 'at' h:mm:ss a")

  return <span className="text-gray-700">{formattedDate}</span>
}
