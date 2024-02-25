// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import themeConfig from 'src/configs/themeConfig'
import { useEffect, useState } from 'react'
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
  const [imageList, setImageList] = useState<Image[]>([]);
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editId, setEditId] = useState("");
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(-1);


  useEffect(() => {
    if (!!fileList) {
      const images: Image[] = [];
      const videos: Video[] = [];

      fileList.map(file => {
        if (file.images) {
          const editImageIndex = file.images.findIndex(image => image._id === editId);

          if (editImageIndex !== -1) {
            // Nếu ảnh đã tồn tại trong fileList, thay thế ảnh có _id trùng với editId
            const updatedImages = [...file.images];
            updatedImages[editImageIndex] = { ...file.images[editImageIndex] };
            images.push(...updatedImages);
          } else {
            // Nếu ảnh chưa tồn tại trong fileList, thêm ảnh và cập nhật title
            images.push(...file.images.map(image => ({ ...image, title: file.title })));
          }
        }

        if (file.videos) {
          const newVideos = file.videos.filter(video => !videos.some(existingVideo => existingVideo._id === video._id));
          if (!!newVideos) {
            videos.push(...newVideos.map(video => ({ ...video, title: file.title })));
          } else {
            videos.push(...file.videos.map(video => ({ ...video })));
          }
        }
      });

      setImageList(images);
      setVideoList(videos);
    }
  }, [fileList])

  const handleOpenEditDialog = (index: number) => {
    setEditingIndex(index);
    setEditDialogOpen(true);
  };

  const handleTitleChange = (newTitle: string) => {
    // Tạo một bản sao của mảng imageList
    const updatedImageList = [...imageList];

    // Cập nhật title cho phần tử có index là editingIndex
    updatedImageList[editingIndex] = {
      ...updatedImageList[editingIndex],
      title: newTitle,
    };

    // Cập nhật state
    setImageList(updatedImageList);
  };

  const handleDescriptionChange = (newDescription: string) => {
    // Tạo một bản sao của mảng imageList
    const updatedImageList = [...imageList];

    // Cập nhật description cho phần tử có index là editingIndex
    updatedImageList[editingIndex] = {
      ...updatedImageList[editingIndex],
      description: newDescription,
    };

    // Cập nhật state
    setImageList(updatedImageList);
  };

  const handleSaveChanges = async () => {
    try {
      // Chuẩn bị dữ liệu mới cần lưu
      const id = imageList[editingIndex]?._id
      const title = imageList[editingIndex]?.title || ''
      const description = imageList[editingIndex]?.description || ''

      setEditId(id)
      dispatch(updateFile({ id, title, description }))

      const response = await updateData(id, title, description)

      console.log('response: ', response);
    } catch (error) {
      console.error('Error during save:', error);
    }

    // Đóng dialog
    setEditDialogOpen(false);
  };

  const handleOpenDeleteDialog = (index: number) => {
    setDeletingIndex(index);
    setConfirmDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeletingIndex(-1);
    setConfirmDeleteDialogOpen(false);
  };

  const handleDeleteImage = async () => {
    try {
      // Lấy id của ảnh cần xóa
      const id = imageList[deletingIndex]?._id

      // Gọi hàm xóa ảnh trong Redux (hoặc nơi khác tùy thuộc vào cách bạn đã triển khai)
      dispatch(deleteFile({id}));
      const response = await deleteData(id)

      console.log('response: ', response);

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
              {imageList.map((file, index) => (
                <Grid item key={index} xs={5} sm={5} md={4} lg={4} xl={4}>
                  <Box
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 3,
                      border: '3px solid transparent',
                      backgroundImage: `linear-gradient(45deg, #ff0000, #ff9900, #ff9900, #33cc33, #0099cc, #9933cc)`,
                    }}
                  >
                    {file.imageUrl && (
                      <>
                        {/* Image */}
                        <CardMedia
                          component="img"
                          image={file.imageUrl}
                          alt={`Image ${index}`}
                          style={{ width: '100%', height: 'auto' }}
                        />

                        {/* Edit and Delete Icons */}
                        <Box sx={{
                          position: 'absolute', top: 0, right: 0, padding: 2, zIndex: 1, background: 'rgba(0, 0, 0, 0.7)'
                        }}>
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="edit-icon"
                            onClick={() => handleOpenEditDialog(index)}
                          />
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="delete-icon"
                            onClick={() => handleOpenDeleteDialog(index)}
                          />
                        </Box>

                        {/* Image Overlay */}
                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: 2, background: 'rgba(0, 0, 0, 0.7)' }}>
                          <Typography variant="h6" color="white" gutterBottom>
                            {file.title}
                          </Typography>
                          <Typography variant="body2" color="white">
                            {file.description}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Box>
                </Grid>
              ))}

              {videoList.map((file, index) => (
                <Grid item key={index} xs={5} sm={5} md={4} lg={4} xl={4}>
                  <Box
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 3,
                      border: '3px solid transparent',
                      backgroundImage: `linear-gradient(45deg, #ff0000, #ff9900, #ff9900, #33cc33, #0099cc, #9933cc)`,
                    }}
                  >
                    {file.videoUrl && (
                      <Card>
                        <CardContent>
                          {/* Video */}
                          <video controls style={{ width: '100%', height: 'auto' }}>
                            <source src={file.videoUrl} type="video/mp4" />
                          </video>

                          {/* Edit and Delete Icons */}
                          <Box sx={{ position: 'absolute', top: 0, right: 0, padding: 2, zIndex: 1, background: 'rgba(0, 0, 0, 0.7)' }}>
                            <FontAwesomeIcon
                              icon={faEdit}
                              className="edit-icon"
                              onClick={() => handleOpenEditDialog(index)}
                            />
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="delete-icon"
                              onClick={() => setDeletingIndex(index)}
                            />
                          </Box>

                          {/* Video Overlay */}
                          <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: 2, background: 'rgba(0, 0, 0, 0.7)' }}>
                            <Typography variant="h6" color="white" gutterBottom>
                              {file.title}
                            </Typography>
                            <Typography variant="body2" color="white">
                              {file.description}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    )}
                  </Box>
                </Grid>
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
            value={imageList[editingIndex]?.title || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          <TextField
            label="Description"
            value={imageList[editingIndex]?.description || ''}
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
