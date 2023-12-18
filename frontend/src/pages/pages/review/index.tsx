import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Input, Button } from '@mui/material';

const ReviewPage = () => {
    const router = useRouter();
    const [reviewFiles, setReviewFiles] = useState<File[]>([]);
    const [titles, setTitles] = useState<string[]>([]);
    const [descriptions, setDescriptions] = useState<string[]>([]);

    useEffect(() => {
        const fetchFiles = async () => {
            if (router.query.selectedFiles) {
                const fileUrls = Array.isArray(router.query.selectedFiles)
                    ? router.query.selectedFiles
                    : [router.query.selectedFiles];

                try {
                    const filesPromises = fileUrls.map(async (fileUrl: string) => {
                        const response = await fetch(fileUrl);
                        const blob = await response.blob();

                        return new File([blob], `file_${Date.now()}`);
                    });

                    const files = await Promise.all(filesPromises);
                    setReviewFiles(files);

                    console.log('File URLs received:', files);
                } catch (error) {
                    console.error('Error fetching files:', error);
                }
            }
        };

        fetchFiles();
    }, [router]);

    const handleTitleChange = (index: number, value: string) => {
        const newTitles = [...titles];
        newTitles[index] = value;
        setTitles(newTitles);
    };

    const handleDescriptionChange = (index: number, value: string) => {
        const newDescriptions = [...descriptions];
        newDescriptions[index] = value;
        setDescriptions(newDescriptions);
    };

    const handleAddImages = () => {
        console.log('Add images success');
    }

    return (
        <div className='container'>
            <h1>Review Uploaded Files</h1>
            <div className='title-container'>
                <Input
                    type='text'
                    placeholder='Enter title'
                    value={titles[reviewFiles.length - 1]}
                    onChange={(e) => handleTitleChange(reviewFiles.length - 1, e.target.value)}
                />
            </div>

            {reviewFiles.map((file, index) => (
                <div key={index} className='file-item'>

                    <div className='image-container'>
                        {file.type.includes('video') ? (
                            <video controls>
                                <source src={URL.createObjectURL(file)} type={file.type} />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img src={URL.createObjectURL(file)} alt={`Uploaded File ${index + 1}`} className='file-image' />
                        )}
                    </div>
                    <div className='description-container'>
                        <input
                            placeholder='Add description'
                            value={descriptions[index]}
                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                            className='description-input'
                        />
                    </div>
                </div>

            ))}
            <Button
                sx={{
                    backgroundColor: 'green',
                    color: 'white',
                    marginLeft:'170px',
                    '&:hover': {
                        backgroundColor: 'darkgreen',
                    },
                }}
                onClick={handleAddImages} className='add-images-button'>
                <span>+</span> Add Images
            </Button>

        </div>
    );
};

export default ReviewPage;
