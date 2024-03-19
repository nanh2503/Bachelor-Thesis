// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import themeConfig from 'src/configs/themeConfig'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'src/app/hooks'
import { Image, Video, deleteFile, updateFile } from 'src/app/redux/slices/fileSlice'

// FontAwesome Import
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { deleteData, updateData } from 'src/services/userServices'

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute'
})

// Thêm biểu tượng vào thư viện FontAwesome
library.add(faEdit, faTrash);

const Dashboard = () => {
  const dispatch = useDispatch();

  const fileList = useSelector((state) => state.fileListState.file);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editId, setEditId] = useState("");
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const handleOpenEditDialog = (id: string) => {
    setEditId(id);
    fileList.map(file => {
      if (file.images.some(image => image._id === id)) {
        setEditTitle(file.title)
        file.images.map(image => {
          if (image._id === id) {
            setEditDescription(image.description)
          }
        })
      }
    })
    setEditDialogOpen(true);
  };

  const handleTitleChange = (newTitle: string) => {
    setEditTitle(newTitle)
  };

  const handleDescriptionChange = (newDescription: string) => {
    setEditDescription(newDescription)
  };

  const handleSaveChanges = async () => {
    try {
      dispatch(updateFile({ editId, editTitle, editDescription }))

      await updateData(editId, editTitle, editDescription)
    } catch (error) {
      console.error('Error during save:', error);
    }

    // Đóng dialog
    setEditDialogOpen(false);
  };

  const handleOpenDeleteDialog = (id: string) => {
    setDeleteId(id);
    setConfirmDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteId("");
    setConfirmDeleteDialogOpen(false);
  };

  const handleDeleteImage = async () => {
    try {

      // Gọi hàm xóa ảnh trong Redux (hoặc nơi khác tùy thuộc vào cách bạn đã triển khai)
      dispatch(deleteFile({deleteId}));
      await deleteData(deleteId)

      // Đóng dialog
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error during delete:', error);
    }
  };

  return (
    <ApexChartWrapper>
      <Card sx={{ position: 'relative', height: '100%' }}>
        <CardContent>
          <Typography variant='h2' mt={20} mb={20} textAlign={'center'}>
            Welcome to {themeConfig.templateName} 🥳
          </Typography>

          {fileList.length ? (
            <Grid container spacing={7} sx={{ mb: 10 }}>
              {fileList.map((file, fileIndex) => (
                <React.Fragment key={fileIndex}>
                  {file.images.map((image, imageIndex) => (
                    <Grid item key={`image-${imageIndex}`} xs={5} sm={5} md={4} lg={4} xl={4}>
                      <Box
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: 3,
                          border: '3px solid transparent',
                          backgroundImage: `linear-gradient(45deg, #ff0000, #ff9900, #ff9900, #33cc33, #0099cc, #9933cc)`,
                        }}
                      >
                        {image.imageUrl && (
                          <>
                            {/* Image */}
                            <CardMedia
                              component="img"
                              image={image.imageUrl}
                              alt={`Image ${imageIndex}`}
                              style={{ width: '100%', height: 'auto' }}
                            />

                            {/* Edit and Delete Icons */}
                            <Box sx={{
                              position: 'absolute', top: 0, right: 0, padding: 2, zIndex: 1, background: 'rgba(0, 0, 0, 0.7)'
                            }}>
                              <FontAwesomeIcon
                                icon={faEdit}
                                className="edit-icon"
                                onClick={() => handleOpenEditDialog(image._id)}
                              />
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="delete-icon"
                                onClick={() => handleOpenDeleteDialog(image._id)}
                              />
                            </Box>

                            {/* Image Overlay */}
                            <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: 2, background: 'rgba(0, 0, 0, 0.7)' }}>
                              <Typography variant="h6" color="white" gutterBottom>
                                {file.title}
                              </Typography>
                              <Typography variant="body2" color="white">
                                {image.description}
                              </Typography>
                            </Box>
                          </>
                        )}
                      </Box>
                    </Grid>
                  ))}
                  {file.videos.map((video, videoIndex) => (
                    <Grid item key={`video-${videoIndex}`} xs={5} sm={5} md={4} lg={4} xl={4}>
                      <Box
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: 3,
                          border: '3px solid transparent',
                          backgroundImage: `linear-gradient(45deg, #ff0000, #ff9900, #ff9900, #33cc33, #0099cc, #9933cc)`,
                        }}
                      >
                        {video.videoUrl && (
                          <Card>
                            <CardContent>
                              {/* Video */}
                              <video controls style={{ width: '100%', height: 'auto' }}>
                                <source src={video.videoUrl} type="video/mp4" />
                              </video>

                              {/* Edit and Delete Icons */}
                              <Box sx={{ position: 'absolute', top: 0, right: 0, padding: 2, zIndex: 1, background: 'rgba(0, 0, 0, 0.7)' }}>
                                <FontAwesomeIcon
                                  icon={faEdit}
                                  className="edit-icon"
                                  onClick={() => handleOpenEditDialog(video._id)}
                                />
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className="delete-icon"
                                  onClick={() => handleOpenDeleteDialog(video._id)}
                                />
                              </Box>

                              {/* Video Overlay */}
                              <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: 2, background: 'rgba(0, 0, 0, 0.7)' }}>
                                <Typography variant="h6" color="white" gutterBottom>
                                  {file.title}
                                </Typography>
                                <Typography variant="body2" color="white">
                                  {video.description}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </React.Fragment>
              ))}
            </Grid>
          ) : <></>}
          <TrophyImg alt='trophy' src='/images/misc/trophy.png' />
        </CardContent>
      </Card>

      {/* Dialog for Editing */}
      <Dialog open={isEditDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={editTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          <TextField
            label="Description"
            value={editDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveChanges}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Confirming Deletion */}
      <Dialog open={confirmDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete this image?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteImage} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ApexChartWrapper>
  )
}

export default Dashboard
