'use client' // is needed only if you're using React Server Components

import React from 'react'
import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';
type Props = {
  onUpload: (fileInfo: any) => void
}

const UploadCareButton = ({ onUpload }: Props) => {
  return (
    <div>
      <FileUploaderRegular
         sourceList="local, camera, facebook, gdrive"
         cameraModes="photo, video"
         classNameUploader="uc-light"
         pubkey="424fd341ee7513f5df48"
         onChange={onUpload}
      />
    </div>
  )
}

export default UploadCareButton