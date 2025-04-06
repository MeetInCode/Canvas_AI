// import ProfileForm from '@/components/forms/profile-form'
// import React from 'react'
// import ProfilePicture from './_components/profile-picture'
// import { db } from '@/lib/db'
// import { currentUser } from '@clerk/nextjs'

import ProfileForm from "@/components/forms/profile-form"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProfilePicture from "./components/profile-picture"
import { db } from "@/lib/db"
// import ProfilePicture from './_components/profile-picture'
// import { db } from '@/lib/db'
// import { currentUser } from '@clerk/nextjs'

type Props = {}

const Settings = async (props: Props) => {
//   const authUser = await currentUser()
//   if (!authUser) return null

//   const user = await db.user.findUnique({ where: { clerkId: authUser.id } })
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
    return response
  }

//   const uploadProfileImage = async (image: string) => {
//     'use server'
//     const id = authUser.id
//     const response = await db.user.update({
//       where: {
//         clerkId: id,
//       },
//       data: {
//         profileImage: image,
//       },
//     })

//     return response
//   }

//   const updateUserInfo = async (name: string) => {
//     'use server'

//     const updateUser = await db.user.update({
//       where: {
//         clerkId: authUser.id,
//       },
//       data: {
//         name,
//       },
//     })
//     return updateUser
//   }

  const mockUser = {
    name: "",
    email: ""
  }

  const handleUpdate = (name: string) => {
    console.log("User name updated:", name)
    // This would typically call a server action
  }

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
          <ProfilePicture userImage={null} onUpload={undefined}></ProfilePicture>
          <ProfileForm user={mockUser}  />
        </CardContent>
      </Card>

      {/* Uncomment when ready to implement
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
            userImage={user?.profileImage || ''}
            onUpload={uploadProfileImage}
          />
        </CardContent>
      </Card> 
      */}
    </div>
  )
}

export default Settings
