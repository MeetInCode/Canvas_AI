import ProfileForm from "@/components/forms/profile-form"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProfilePicture from "./components/profile-picture"
import { db } from "@/lib/db"

import { currentUser } from '@clerk/nextjs/server'

type Props = {}

const Settings = async (props: Props) => {
  const authUser = await currentUser()
  if (!authUser) return null

  console.log("Auth user:", authUser.id)
  
  // Fetch user from database
  const user = await db.user.findUnique({ 
    where: { clerkId: authUser.id } 
  })
  
  console.log("✅✅ User data fetched from database:")
  
  // If user doesn't exist in our database, create them
  if (!user) {
    console.log("User not found in database, creating new user")
    try {
      const newUser = await db.user.create({
        data: {
          clerkId: authUser.id,
          email: authUser.emailAddresses[0]?.emailAddress || "",
          name: authUser.firstName || "",
          profileImage: authUser.imageUrl || "",
        }
      })
      console.log("✅✅ New user created in database:")
    } catch (error) {
      console.error("Failed to create user in database:", error)
    }
  }
  
  const removeProfileImage = async () => {
    'use server'
    const response = await db.user.update({
      where: {
        clerkId: authUser.id,
      },
      data: {
        profileImage: '',
      },
    })
    console.log("✅✅ Profile image removed from database")
    return response
  }

  const uploadProfileImage = async (image: string) => {
    'use server'
    const id = authUser.id
    const response = await db.user.update({
      where: {
        clerkId: id,
      },
      data: {
        profileImage: image,
      },
    })
    console.log("✅✅ Profile image uploaded to database")
    return response
  }

  const updateUserInfo = async (name: string) => {
    'use server'

    const updateUser = await db.user.update({
      where: {
        clerkId: authUser.id,
      },
      data: {
        name,
      },
    })
    console.log("✅✅ User information updated in database")
    return updateUser
  }

  const mockUser = {
    name: "",
    email: ""
  }

  // const handleUpdate = (name: string) => {
  //   console.log("User name updated:", name)
  //   // This would typically call a server action
  // }

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>
            Add or update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user ? {
            name: user.name || '',
            email: user.email,
            clerkId: user.clerkId
          } : {
            name: authUser.firstName || '',
            email: authUser.emailAddresses[0]?.emailAddress || '',
            clerkId: authUser.id
          }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Upload or change your profile picture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfilePicture
            onDelete={removeProfileImage}
            userImage={user?.profileImage || null}
            onUpload={uploadProfileImage}
          />
        </CardContent>
      </Card> 
    </div>
  )
}

export default Settings
