// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import { Card, CardContent, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import themeConfig from 'src/configs/themeConfig'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'src/app/hooks'
import { deleteImage, updateImage, updateVideo, deleteVideo } from 'src/app/redux/slices/fileSlice'

// FontAwesome Import
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { deleteData, updateData } from 'src/services/fileServices'
import { useRouter } from 'next/router'

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
  const router = useRouter();

  const fileList = useSelector((state) => state.fileListState.file);
  console.log('check fileList: ', fileList);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editId, setEditId] = useState("");
  const [tagList, setTagList] = useState<string[]>([]);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [fileEdit, setFileEdit] = useState("")
  const [fileDelete, setFileDelete] = useState("")

  const handleOpenEditDialog = (id: string, fileEdit: string) => {
    setFileEdit(fileEdit)
    setEditId(id);
    if (fileEdit === 'image') {
      fileList.map(file => {
        if (file.images.some(image => image._id === id)) {
          setEditTitle(file.title)
          setTagList(file.tagList)
          file.images.map(image => {
            if (image._id === id) {
              setEditDescription(image.description)
            }
          })
        }
      })
    } else {
      fileList.map(file => {
        if (file.videos.some(video => video._id === id)) {
          setEditTitle(file.title)
          setTagList(file.tagList)
          file.videos.map(video => {
            if (video._id === id) {
              setEditDescription(video.description)
            }
          })
        }
      })
    }

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
      if (fileEdit === 'image') {
        dispatch(updateImage({ editId, editTitle, editDescription, editTagList: tagList }))
      } else {
        dispatch(updateVideo({ editId, editTitle, editDescription, editTagList: tagList }))
      }

      await updateData(editId, editTitle, editDescription)
    } catch (error) {
      console.error('Error during save:', error);
    }

    // Đóng dialog
    setEditDialogOpen(false);
  };

  const handleOpenDeleteDialog = (id: string, fileDelete: string) => {
    setFileDelete(fileDelete)
    setDeleteId(id);
    setConfirmDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteId("");
    setConfirmDeleteDialogOpen(false);
  };

  const handleDeleteImage = async () => {
    try {

      if (fileDelete === 'image') {
        dispatch(deleteImage({ deleteId }));
      } else {
        dispatch(deleteVideo({ deleteId }))
      }

      await deleteData(deleteId)

      // Đóng dialog
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error during delete:', error);
    }
  };

  const handleViewImage = (id: string, fileView: string) => {
    router.push(`/view/${fileView}/${id}`)
  }

  return (
    <ApexChartWrapper>
      <Card sx={{ position: 'relative', height: '100%' }}>
        <CardContent>
          <Typography variant='h2' mt={20} mb={20} textAlign={'center'}>
            Welcome to {themeConfig.templateName} 🥳
          </Typography>
          <div className='container-box'>
            {fileList.map((file, fileIndex) => (
              <React.Fragment key={fileIndex}>
                {file.images.map((image, imageIndex) => (
                  <div key={`image-${imageIndex}`} >
                    <div
                      style={{
                        marginBottom: '20px',
                        breakInside: 'avoid',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '15px',
                        border: '3px solid transparent',
                        backgroundImage: 'linear-gradient(45deg, #ff0000, #ff9900, #ff9900, #33cc33, #0099cc, #9933cc)',
                        cursor: 'pointer'
                      }}
                    >
                      {image.imageUrl && (
                        <>
                          <div onClick={() => handleViewImage(image._id, "image")}>
                            {/* Image */}
                            <img src={image.imageUrl} alt={`Image ${imageIndex}`} style={{ width: '100%', height: 'auto' }} />
                            {/* Image Overlay */}
                            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '10px', background: 'rgba(0, 0, 0, 0.7)' }}>
                              <div style={{ display: 'flex', position: 'relative' }}>
                                <div>
                                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>{file.title}</div>
                                  <div style={{ color: 'white', fontSize: '14px', margin: '5px 0' }}>{image.description}</div>
                                </div>
                                <div style={{ display: 'flex', marginLeft: '20px' }}>
                                  {file.tagList.map((tag, index) => (
                                    <div key={index} style={{ color: 'silver', fontSize: '14px', marginLeft: '5px', marginTop: '30px', fontStyle: 'italic' }}>
                                      #{tag}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Edit and Delete Icons */}
                          <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px', zIndex: 1, background: 'rgba(0, 0, 0, 0.7)' }}>
                            <FontAwesomeIcon
                              icon={faEdit}
                              className="edit-icon"
                              onClick={() => handleOpenEditDialog(image._id, "image")}
                            />
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="delete-icon"
                              onClick={() => handleOpenDeleteDialog(image._id, "image")}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {file.videos.map((video, videoIndex) => (
                  <div key={`video-${videoIndex}`}>
                    <div
                      style={{
                        marginBottom: '20px',
                        breakInside: 'avoid',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '15px',
                        border: '3px solid transparent',
                        backgroundImage: 'linear-gradient(45deg, #ff0000, #ff9900, #ff9900, #33cc33, #0099cc, #9933cc)',
                      }}
                    >
                      {video.videoUrl && (
                        <div>
                          {/* Video */}
                          <video controls style={{ width: '100%', height: 'auto' }}>
                            <source src={video.videoUrl} type="video/mp4" />
                          </video>

                          {/* Edit and Delete Icons */}
                          <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px', zIndex: 1, background: 'rgba(0, 0, 0, 0.7)' }}>
                            <FontAwesomeIcon
                              icon={faEdit}
                              className="edit-icon"
                              onClick={() => handleOpenEditDialog(video._id, "video")}
                            />
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="delete-icon"
                              onClick={() => handleOpenDeleteDialog(video._id, "video")}
                            />
                          </div>

                          {/* Video Overlay */}
                          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '10px', background: 'rgba(0, 0, 0, 0.7)' }}>
                            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>{file.title}</div>
                            <div style={{ color: 'white', fontSize: '14px', margin: '5px 0' }}>{video.description}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <TrophyImg alt='trophy' src='/images/pages/trophy.png' />
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
