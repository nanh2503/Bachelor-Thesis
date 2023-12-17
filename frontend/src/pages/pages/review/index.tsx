import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const ReviewPage = () => {
    const router = useRouter()
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])

    useEffect(() => {
        const { selectedFiles: selectedFilesParam } = router.query;
      
        if (typeof selectedFilesParam === 'string') {
          const fileNames = selectedFilesParam.split(','); // Phân tách các tên tệp tin từ chuỗi bằng dấu phẩy
          setSelectedFiles(fileNames);
        }
      }, [router.query]);
      
      

    console.log('selectedFiles-review: ', selectedFiles);

    return (
        <div className='container'>
            <h1>Review Uploaded Files</h1>
            <div className='files-container'>
                {selectedFiles.map((fileUrl, index) => (
                    <div key={index} className='file-item'>
                        {typeof fileUrl === 'string' && fileUrl.includes('.mp4')
                            ? (
                                <video controls>
                                    <source src={fileUrl} type='video/mp4' />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img src={fileUrl} alt={`Uploaded File ${index + 1}`} />
                            )

                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ReviewPage