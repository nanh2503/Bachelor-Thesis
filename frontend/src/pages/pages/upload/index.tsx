import React from 'react';
import { Box, Button, Input, Typography } from '@mui/material';

import './style.module.scss';

const UploadPage = () => {
  return (
    <Box className="Dialog UploadDialog">
      <Box className="Dialog-wrapper">
        <Button variant="contained" aria-label="close" className="PopUpClose">
          <img
            src="https://s.imgur.com/desktop-assets/desktop-assets/upload_dialog_close.090c128bffd440597750.svg"
            alt="Close"
          />
        </Button>
        <Box className="PopUpContainer">
          <Box className="PopUpDrop">
            <Box className="PopUpDrop-content" sx={{ opacity: 1 }}>
              <Box className="PopUpDrop-indicator"></Box>
              <Typography variant="body1" className="PopUpDrop-label">
                Drop images here
              </Typography>
            </Box>
            <Box className="PopUpDrop-Comets" sx={{ opacity: 0 }}>
              <Box className="PopUpDrop-Comets-Comet PopUpDrop-Comets-Comet1" sx={{ opacity: 1, transform: 'none' }}></Box>
              <Box className="PopUpDrop-Comets-Comet PopUpDrop-Comets-Comet2" sx={{ opacity: 1, transform: 'none' }}></Box>
            </Box>
            <Box className="PopUpDrop-Stars" sx={{ opacity: 0 }}>
              <Box className="PopUpDrop-Stars-Star PopUpDrop-Stars-Star1" sx={{ transform: 'none' }}></Box>
              <Box className="PopUpDrop-Stars-Star PopUpDrop-Stars-Star2" sx={{ transform: 'none' }}></Box>
              <Box className="PopUpDrop-Stars-Star PopUpDrop-Stars-Star3" sx={{ transform: 'none' }}></Box>
              <Box className="PopUpDrop-Stars-Star PopUpDrop-Stars-Star4" sx={{ transform: 'none' }}></Box>
            </Box>
            <Box className="PopUpDrop-Bg"></Box>
            <Box className="PopUpDrop-Daylight" sx={{ opacity: 1 }}></Box>
            <Box className="PopUpDrop-DaylightSky" sx={{ opacity: 1 }}></Box>
            <Box className="PopUpDrop-Observatory"></Box>
            <Box className="PopUpDrop-DropArea"></Box>
          </Box>
          <Box className="PopUpActions">
            <Input
              id="file-input"
              type="file"
              name="files"
              className="PopUpActions-fileInput"
            />
            <label htmlFor="file-input" className="PopUpActions-filePicker">
              <img
                src="https://s.imgur.com/desktop-assets/desktop-assets/icon-photo.e5fd72ac37a762a402ea.svg"
                alt="Choose Photo/Video"
              />
              Choose Photo/Video
            </label>
            <Box className="PopUpActions-divider">
              <span className="PopUpActions-divider--line"></span>
              or
              <span className="PopUpActions-divider--line"></span>
            </Box>
            <Box className="PopUpActions-textPicker">
              <Input placeholder="Paste image or URL" tabIndex={12} />
            </Box>
            <Box className="PopUpActions-extra">
              <Button type="button" tabIndex={13}>
                <img src="https://s.imgur.com/desktop-assets/desktop-assets/meme.1719bac60b7861cbd5e9.svg" alt="Meme Gen" />
                Meme Gen
              </Button>
              <Button type="button" disabled tabIndex={14}>
                <img src="https://s.imgur.com/desktop-assets/desktop-assets/browse.7a7c32874c696f6255a8.svg" alt="My Uploads" />
                My Uploads
              </Button>
            </Box>
          </Box>
        </Box>
        <Box className="PopUpTOS">
          <Typography variant="body1">
            By creating a post, you agree to Imgur's{' '}
            <a href="https://imgur.com/tos" target="_blank" rel="noopener noreferrer" tabIndex={15}>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="https://imgur.com/privacy" target="_blank" rel="noopener noreferrer" tabIndex={16}>
              Privacy Policy
            </a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default UploadPage;
