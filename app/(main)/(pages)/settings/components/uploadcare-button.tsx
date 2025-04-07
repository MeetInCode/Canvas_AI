'use client' // is needed only if you're using React Server Components

import React from 'react'
import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

type Props = {
  onUpload: (fileInfo: { cdnUrl: string }) => void
}

const UploadCareButton = ({ onUpload }: Props) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <FileUploaderRegular
        sourceList="local, camera, facebook, gdrive"
        cameraModes="photo"
        classNameUploader="uc-light"
        pubkey="424fd341ee7513f5df48"
        onChange={(fileInfo) => {
          if (fileInfo?.successEntries?.[0]?.cdnUrl) {
            onUpload({ cdnUrl: fileInfo.successEntries[0].cdnUrl });
          }
        }}
        maxLocalFileSizeBytes={5000000} // 5MB limit
        multiple={false}
      />
      <p className="text-sm text-gray-500">Supported formats: JPG, PNG, GIF (max 5MB)</p>
    </div>
  )
}

export default UploadCareButton