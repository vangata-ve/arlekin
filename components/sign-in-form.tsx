"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"

interface User {
  id: string
  email: string
  name: string
}

interface SignInFormProps {
  onSignIn: (user: User) => void
}

export function SignInForm({ onSignIn }: SignInFormProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user: User = {
      id: Date.now().toString(),
      email,
      name,
    }

    onSignIn(user)
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Добре дошли в Арлекин жива карта!</CardTitle>
        <CardDescription>Влезте в своя акаунт, за да започнете да добавяте вашите видеа и снимки</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Пълно име</Label>
            <Input
              id="name"
              type="text"
              placeholder="Въведете пълнот си име"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Имейл</Label>
            <Input
              id="email"
              type="email"
              placeholder="Въведете своя имейл"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !email || !name}>
            {isLoading ? "Влизане в акаунта..." : "Влез"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
