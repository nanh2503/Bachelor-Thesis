import React, { useState, useEffect } from 'react';
import styles from '/styles/adminUserManagement.module.scss';
import ReactPaginate from 'react-paginate';
import { Magnify } from 'mdi-material-ui';
import { handleFetchData } from 'src/services/fileServices';
import Link from 'next/link';

interface FileList {
    _id: string,
    username: string,
    file: FileList[],
    imagesNum: number,
    videosNum: number,
}

const CollectionComponent = () => {
    const [data, setData] = useState<FileList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(0);
    const usersPerPage = 5;
    const [arg, setArg] = useState("All");
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        const res = await handleFetchData(arg);
        const fileData = res.data.file;
        console.log('check userData: ', fileData);

        setData(fileData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Tính toán dữ liệu phân trang
    const offset = currentPage * usersPerPage;
    // const filteredUsers = data.filter((data) =>
    //     data._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    // data.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    // data.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    // data.role.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    const currentPageData = data.slice(offset, offset + usersPerPage);
    const pageCount = Math.ceil(data.length / usersPerPage);

    const handlePageClick = ({ selected }: { selected: number }) => {
        setCurrentPage(selected);
    };

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('check event.target.value: ', event.target.value);
        setSearchTerm(event.target.value);
        setCurrentPage(0);
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>User Management</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className={styles.content}>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                            className={styles.searchInput}
                        />
                        <button>
                            <Magnify />
                        </button>
                    </div>
                    <table className={styles.userTable}>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>ID</th>
                                <th>Username</th>
                                <th>FileList</th>
                                <th>NumOfImage</th>
                                <th>NumOfVideo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.map((data, index) => (
                                <tr key={data._id}>
                                    <td>{offset + index + 1}</td>
                                    <td>{data._id}</td>
                                    <td>{data.username}</td>
                                    <td>
                                        <Link href={`/collection/show-fileList/${data._id}`}>Show here</Link>
                                    </td>
                                    <td><strong>{data.imagesNum}</strong></td>
                                    <td><strong>{data.videosNum}</strong></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ReactPaginate
                previousLabel={'Prev'}
                nextLabel={'Next'}
                breakLabel={'...'}
                breakClassName={styles.dots}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={styles.pagination}
                activeClassName={styles.active}
                previousClassName={currentPage === 0 ? styles.disabled : styles.previous}
                nextClassName={currentPage === pageCount - 1 ? styles.disabled : styles.next}
            />
        </div>
    );
};

export default CollectionComponent;
