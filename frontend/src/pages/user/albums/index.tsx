import React, { useEffect, useState } from 'react';
import styles from '/styles/album.module.scss';
import NewAlbumDialog from 'src/components/common/NewAlbumDialog';
import { useSelector } from 'src/app/hooks';
import { handleCreateAlbumService, handleGetAllAlbumService } from 'src/services/albumServices';
import { base64ToFileImage } from 'src/utils/convertBase64ToFile';
import { getSignatureForUpload, uploadFile } from 'src/utils/uploadFileToCloud';
import { useRouter } from 'next/router';

export interface Album {
    _id: string;
    avatarUrl: string;
    albumName: string;
    description: string;
}

export interface NewAlbumState {
    avatar: string;
    albumName: string;
    description: string;
}

const AlbumPage = () => {

    const router = useRouter();

    const user = useSelector((state) => state.localStorage.userState.user);

    const [albums, setAlbums] = useState<Album[]>([]);
    const [showNewAlbumForm, setShowNewAlbumForm] = useState(false);

    useEffect(() => {
        const fetchAlbums = async () => {
            if (user) {
                try {
                    const res = await handleGetAllAlbumService(user._id, 'All');
                    const file = res.data.file[0].albumList;
                    console.log('check res effect: ', res.data.file[0].albumList);

                    setAlbums(file);
                } catch (e) {
                    console.error(e);
                }
            }
        };

        fetchAlbums();
    }, []);

    const handleNewAlbumClick = () => {
        setShowNewAlbumForm(true);
    };

    const handleAddAlbum = async (newAlbum: NewAlbumState) => {
        console.log('check newAlbum: ', newAlbum);
        const { avatar, albumName, description } = newAlbum;
        const imageFiles: File[] = [];

        if (avatar) {
            console.log('check avatar');
            const avatarFile = await base64ToFileImage(avatar);
            imageFiles.push(avatarFile);
        }

        const userId = user?._id;

        if (!!userId) {
            try {
                const { timestamp: imageTimestamp, signature: imageSignature } = await getSignatureForUpload('images');

                const avatarUrls: string[] = await uploadFile('image', imageTimestamp, imageSignature, imageFiles);

                const avatarUrl = avatarUrls[0];

                console.log('check avatarUrl: ', avatarUrl);

                const res = await handleCreateAlbumService(userId, avatarUrl, albumName, description);
                console.log('check res: ', res);

                const response = await handleGetAllAlbumService(user._id, 'newest');
                console.log('check response: ', response);

                const file = response.data.file[0].albumList;
                setAlbums(file);
            } catch (error) {
                console.error('Error while creating album:', error);
            }
        }
    };

    const handleShowAlbum = (albumId: string) => {
        router.push(`/user/albums/show-album/${albumId}`);
    }

    return (
        <div className={styles['album-page']}>
            <div className={styles['album-header']}>
                <h2>Albums</h2>
            </div>
            <div className={styles['album-list']}>
                {albums?.map((album, index) => (
                    <div key={index} className={styles['album-item']} onClick={() => handleShowAlbum(album._id)}>
                        <div className={styles['album-thumbnail']}>
                            {album.avatarUrl ? <img src={album.avatarUrl} alt={album.albumName} /> : 'No Image'}
                        </div>
                        <strong>{album.albumName}</strong>
                        <p>{album.description}</p>
                    </div>
                ))}
                <div
                    className={styles['album-create-placeholder']}
                    onClick={handleNewAlbumClick}
                >
                    <div className={styles['plus-icon']}>✚</div>
                    Create New Album
                </div>
            </div>

            <NewAlbumDialog
                isOpen={showNewAlbumForm}
                onClose={() => setShowNewAlbumForm(false)}
                onAddAlbum={handleAddAlbum}
            />
        </div>
    );
};

export default AlbumPage;
