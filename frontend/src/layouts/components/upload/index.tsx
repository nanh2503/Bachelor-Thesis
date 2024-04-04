import React, { PropsWithoutRef, useCallback, useEffect, useState } from 'react';
import { Input } from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch } from 'src/app/hooks';
import { setImagesReview, setVideosReview } from 'src/app/redux/slices/uploadFileSlice';

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const UploadForm = (props: PropsWithoutRef<{
  onUploadComplete?: () => void;
}>) => {
  const { onUploadComplete = () => { } } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pasteURLFiles, setPasteURLFiles] = useState<string>('')

  useEffect(() => {
    const processFiles = async () => {
      if (selectedFiles.length > 0 || pasteURLFiles.length>0) {
        onUploadComplete();

        const imageFiles: string[] = [];
        const videoFiles: string[] = [];

        if (selectedFiles.length > 0){
          for (const file of selectedFiles) {
            if (file.type.startsWith('image/')) {
              const base64Image = await convertFileToBase64(file);
              imageFiles.push(base64Image);
            } else if (file.type.startsWith('video/')) {
              const base64Video = await convertFileToBase64(file);
              videoFiles.push(base64Video);
            }
          }
        }
        
        if(pasteURLFiles.length>0){
          imageFiles.push(pasteURLFiles);
        }


        dispatch(setImagesReview(imageFiles));
        dispatch(setVideosReview(videoFiles));

        router.push('/review');
      }
    };

    processFiles();
  }, [selectedFiles, pasteURLFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  }

  const handlePasteURL = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileURL = event.target.value;
    if (fileURL && fileURL.length > 0) {
      setPasteURLFiles(fileURL);
    }
  }

  return (
    <div className="Dialog UploadDialog">
      <div className="Dialog-wrapper">
        <button type="button" aria-label="close" className="PopUpClose">
          <img src="/images/pages/upload/close.svg" alt="Close" />
        </button>
        <div className="PopUpContaner">
          <div className="PopUpDrop" draggable onDragOver={handleDragOver} onDrop={handleDrop}>
            <div className="PopUpDrop-content" style={{ opacity: 1 }}>
              <div className="PopUpDrop-indicator"></div>
              <div className="PopUpDrop-label">
                <div id="drop-area">
                  Drop images here
                </div>
              </div>
            </div>
            <div className="PopUpDrop-Bg"></div>
            <div className="PopUpDrop-Daylight" style={{ opacity: 1 }}></div>
            <div className="PopUpDrop-DaylightSky" style={{ opacity: 1 }}></div>
            <div className="PopUpDrop-Observatory"></div>
          </div>
          <div className="PopUpActions">
            <Input
              id="file-input"
              type="file"
              name="files"
              className="PopUpActions-fileInput"
              tabIndex={11}
              onChange={handleFileChange}
              inputProps={{ multiple: true }}
            />
            <label htmlFor="file-input" className="PopUpActions-filePicker">
              <img src="/images/pages/upload/photo.svg" alt="Choose Photo/Video" />
              Choose Photo/Video
            </label>
            <div className="PopUpActions-divider">
              <span className="PopUpActions-divider--line"></span>
              or
              <span className="PopUpActions-divider--line"></span>
            </div>
            <div className="PopUpActions-textPicker">
              <Input
                placeholder="Paste image or URL"
                tabIndex={12}
                onChange={handlePasteURL}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
