// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import { Box, Card, CardContent, Divider, Menu, MenuItem, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import themeConfig from 'src/configs/themeConfig'
import React, { SyntheticEvent, useState } from 'react'
import { useDispatch, useSelector } from 'src/app/hooks'
import { deleteImage, updateImage, updateVideo, deleteVideo } from 'src/app/redux/slices/fileSlice'

// FontAwesome Import
import { faEdit, faTrash, faLink, faEllipsisVertical, faUpDownLeftRight, faChevronRight, faShareNodes, faDownload, faPencil, faCrop } from '@fortawesome/free-solid-svg-icons';
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


const Dashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const fileList = useSelector((state) => state.fileListState.file);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editId, setEditId] = useState("");
  const [tagList, setTagList] = useState<string[]>([]);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [fileEdit, setFileEdit] = useState("");
  const [fileDelete, setFileDelete] = useState("");
  const [copyMes, setCopyMes] = useState(false);
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null);
  const [subAnchorEl, setSubAnchorEl] = useState<null | HTMLElement>(null);
  const [menuId, setMenuId] = useState("");
  const [menuType, setMenuType] = useState("");

  const handleOpenEditDialog = (id: string, fileEdit: string) => {
    setFileEdit(fileEdit)
    setEditId(id);
    if (fileEdit === 'image') {
      fileList?.map(file => {
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
      fileList?.map(file => {
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

  const handleViewImageOnMenu = () => {
    router.push(`/view/${menuType}/${menuId}`);
  }

  const handleClickToCopy = (text: string) => {
    const input = document.createElement('input'); //tạo thẻ input giả
    document.body.appendChild(input); //gán thẻ đó vào bất kì đâu
    input.value = text; //gán giá trị vào input
    input.select(); //focus vào input
    document.execCommand('copy'); //copy text từ input
    input.remove();

    setCopyMes(true);
  }

  const handleCopyLink = (id: string, fileView: string) => {
    const port = process.env.NEXT_PUBLIC_PORT;

    const link = `http://localhost:${port}/view-file/${fileView}/${id}/`;
    handleClickToCopy(link);
  }

  const handleMenuOpen = (event: SyntheticEvent, id: string, fileView: string) => {
    setMenuId(id);
    setMenuType(fileView);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSubMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSubAnchorEl(event.currentTarget);
  }

  const handleSubMenuClose = () => {
    setSubAnchorEl(null);
  };

  const handleCropImage = () => {
    router.push(`/crop/${menuType}/${menuId}`)
  }

  return (
    <ApexChartWrapper>
      <Card sx={{ position: 'relative', height: '100%' }}>
        <CardContent>
          <Typography variant='h2' mt={20} mb={20} textAlign={'center'}>
            Welcome to {themeConfig.templateName} 🥳
          </Typography>
          <div className='container-box'>
            {fileList?.map((file, fileIndex) => (
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

                          <div style={{ position: 'absolute', top: 0, right: 0, paddingTop: '10px', zIndex: 1 }}>
                            <div className='icon-container'>
                              <FontAwesomeIcon
                                icon={faLink}
                                className="copy-link-icon"
                                onClick={() => handleClickToCopy(image.base64Code)}
                                onMouseLeave={() => setCopyMes(false)}
                              />
                              <div className='mes'>
                                {!copyMes ? " Copy Link" : "Copied!"}
                              </div>
                            </div>
                            <div className='icon-container'>
                              <FontAwesomeIcon
                                icon={faEllipsisVertical}
                                aria-haspopup="true"
                                className="menu-icon"
                                onClick={(e) => handleMenuOpen(e, image._id, "image")}
                              />
                              <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                sx={{ '& .MuiMenu-paper': { width: 200, marginTop: 2 } }}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                              >
                                <MenuItem sx={{ p: 0 }} onClick={handleViewImageOnMenu}>
                                  <FontAwesomeIcon
                                    icon={faUpDownLeftRight}
                                    className='icon'
                                  />
                                  Open
                                </MenuItem>
                                <MenuItem
                                  sx={{ p: 0 }}
                                  onClick={handleSubMenuOpen}
                                >
                                  <FontAwesomeIcon
                                    icon={faEdit}
                                    className='icon'
                                  />
                                  Edit
                                  <FontAwesomeIcon
                                    icon={faChevronRight}
                                    className={`icon-right ${Boolean(subAnchorEl) ? 'active' : ''}`}
                                  />
                                </MenuItem>
                                <Menu
                                  anchorEl={subAnchorEl}
                                  open={Boolean(subAnchorEl)}
                                  onClose={handleSubMenuClose}
                                  sx={{ '& .MuiMenu-paper': { width: 200, marginTop: -10, marginLeft: 1 } }}
                                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                >
                                  <MenuItem sx={{ p: 0 }} onClick={handleCropImage}>
                                    <FontAwesomeIcon
                                      icon={faCrop}
                                      className='icon'
                                    />
                                    Crop
                                  </MenuItem>
                                </Menu>
                                <Divider />
                                <MenuItem sx={{ p: 0 }} onClick={handleMenuClose}>
                                  <FontAwesomeIcon
                                    icon={faDownload}
                                    className='icon'
                                  />
                                  Download
                                </MenuItem>
                                <MenuItem sx={{ p: 0 }} onClick={handleMenuClose}>
                                  <FontAwesomeIcon
                                    icon={faShareNodes}
                                    className='icon'
                                  />
                                  Share
                                </MenuItem>
                                <Divider />
                                <MenuItem sx={{ p: 0 }} onClick={() => handleOpenDeleteDialog(image._id, "image")}>
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    className='icon'
                                  />
                                  Delete
                                </MenuItem>
                              </Menu>
                            </div>
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
                              icon={faLink}
                              className="copy-link-icon"
                              onClick={() => handleOpenEditDialog(video._id, "video")}
                            />
                            <FontAwesomeIcon
                              icon={faEllipsisVertical}
                              className="menu-icon"
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
