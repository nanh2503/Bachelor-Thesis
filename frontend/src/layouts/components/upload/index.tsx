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

  useEffect(() => {
    const processFiles = async () => {
      if (selectedFiles.length > 0) {
        onUploadComplete();

        const imageFiles: string[] = [];
        const videoFiles: string[] = [];

        for (const file of selectedFiles) {
          if (file.type.startsWith('image/')) {
            const base64Image = await convertFileToBase64(file);
            imageFiles.push(base64Image);
          } else if (file.type.startsWith('video/')) {
            const base64Video = await convertFileToBase64(file);
            videoFiles.push(base64Video);
          }
        }

        dispatch(setImagesReview(imageFiles));
        dispatch(setVideosReview(videoFiles));

        router.push('/review');
      }
    };

    processFiles();
  }, [selectedFiles]);

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

  return (
    <div className="Dialog UploadDialog">
      <div className="Dialog-wrapper">
        <button type="button" aria-label="close" className="PopUpClose">
          <img src="https://s.imgur.com/desktop-assets/desktop-assets/upload_dialog_close.090c128bffd440597750.svg" alt="Close" />
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
              <img src="https://s.imgur.com/desktop-assets/desktop-assets/icon-photo.e5fd72ac37a762a402ea.svg" alt="Choose Photo/Video" />
              Choose Photo/Video
            </label>
            <div className="PopUpActions-divider">
              <span className="PopUpActions-divider--line"></span>
              or
              <span className="PopUpActions-divider--line"></span>
            </div>
            <div className="PopUpActions-textPicker">
              <Input placeholder="Paste image or URL" tabIndex={12} />
            </div>
            <div className="PopUpActions-extra">
              <button type="button" tabIndex={13}>
                <img src="https://s.imgur.com/desktop-assets/desktop-assets/meme.1719bac60b7861cbd5e9.svg" alt="Meme Gen" />
                Meme Gen
              </button>
              <button type="button" disabled tabIndex={14}>
                <img src="https://s.imgur.com/desktop-assets/desktop-assets/browse.7a7c32874c696f6255a8.svg" alt="My Uploads" />
                My Uploads
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
