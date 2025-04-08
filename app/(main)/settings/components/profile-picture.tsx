'use client'
import React from 'react'
import UploadCareButton from './uploadcare-button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

type Props = {
  userImage: string | null
  onDelete?: () => Promise<any>
  onUpload: (imageUrl: string) => Promise<any>
}

const ProfilePicture = ({ userImage, onDelete, onUpload }: Props) => {
  const router = useRouter()

  const onRemoveProfileImage = async () => {
    if (onDelete) {
      const response = await onDelete()
      if (response) {
        router.refresh()
      }
    }
  }

  const handleUpload = async (fileInfo: { cdnUrl: string }) => {
    try {
      const response = await onUpload(fileInfo.cdnUrl)
      if (response) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-gray-200">
        {userImage ? (
          <Image
            src={userImage}
            alt="Profile Picture"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-400">No image</p>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        {userImage ? (
          <Button
            onClick={onRemoveProfileImage}
            variant="outline"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-2" /> Remove Picture
          </Button>
        ) : (
          <UploadCareButton onUpload={handleUpload} />
        )}
      </div>
    </div>
  )
}

export default ProfilePicture
