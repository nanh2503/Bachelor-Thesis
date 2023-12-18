import React, { useEffect, useState } from 'react';
import { Input } from '@mui/material';
import { useRouter } from 'next/router';

const UploadPage: React.FC = () => {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  console.log('setSelectedFiles-upload: ', selectedFiles);
  useEffect(() => {
    if (selectedFiles.length > 0) {
      router.push({
        pathname: '/pages/review',
        query: { selectedFiles: selectedFiles.map(file => URL.createObjectURL(file)) },
      });
    }
  }, [selectedFiles, router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  };

  return (
    <div className="Dialog UploadDialog">
      <div className="Dialog-wrapper">
        <button type="button" aria-label="close" className="PopUpClose">
          <img src="https://s.imgur.com/desktop-assets/desktop-assets/upload_dialog_close.090c128bffd440597750.svg" alt="Close" />
        </button>
        <div className="PopUpContaner">
          <div className="PopUpDrop">
            <div className="PopUpDrop-content" style={{ opacity: 1 }}>
              <div className="PopUpDrop-indicator"></div>
              <div className="PopUpDrop-label">Drop images here</div>
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

export default UploadPage;
