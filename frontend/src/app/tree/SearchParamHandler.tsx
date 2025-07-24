'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

interface Props {
  onCreate: (typeId: number) => void
}

export default function SearchParamHandler({ onCreate }: Props) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const typeId = searchParams.get("new")
    if (typeId) {
      onCreate(Number(typeId))
    }
  }, [searchParams, onCreate])

  return null
}
