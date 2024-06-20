import React, { useState, useEffect } from 'react';
import styles from '/styles/adminUserManagement.module.scss';
import { handleGetAllUserService } from 'src/services/userServices';
import { useSelector } from 'src/app/hooks';
import { User } from 'src/app/redux/slices/userSlice';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactPaginate from 'react-paginate';
import DeleteDialog from '../dashboard/DeleteDialog';

const AdminUserManagement: React.FC = () => {
  const accessToken = useSelector((state) => state.localStorage.userState.accessToken);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User>()
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 5;
  const [arg, setArg] = useState("All");

  console.log('check accessToken: ', accessToken);

  useEffect(() => {
    const fetchUsers = async () => {
      const userData = await handleGetAllUserService(accessToken, arg);
      console.log('check userData: ', userData);

      const sortedUsers = userData.data.user.sort((a: User, b: User) => {
        if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
        if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;

        return 0;
      });

      setUsers(sortedUsers);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Tính toán dữ liệu phân trang
  const offset = currentPage * usersPerPage;
  const currentPageData = users.slice(offset, offset + usersPerPage);
  const pageCount = Math.ceil(users.length / usersPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const handleOpenDeleteDialog = (user: User) => {
    setOpenDeleteDialog(true);
    setDeleteUser(user);
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user._id !== userId);
    setUsers(updatedUsers);
    setOpenDeleteDialog(false);
  };

  const handleCancelDialog = () => {
    setOpenDeleteDialog(false);
  }

  return (
    <div className={styles.container}>
      <h1>User Management</h1>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>No.</th>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((user, index) => (
            <tr key={user._id}>
              <td>{offset + index + 1}</td>
              <td>{user._id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <strong>
                  {user.role}
                </strong>
              </td>
              <td>
                <FontAwesomeIcon
                  icon={faTrash}
                  className={styles.icon}
                  onClick={() => handleOpenDeleteDialog(user)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

      {
        isOpenDeleteDialog && deleteUser && (
          <DeleteDialog
            deleteId={deleteUser?._id}
            deleteType='user'
            onDelete={handleDeleteUser}
            onCancel={handleCancelDialog}
          />
        )
      }
    </div>
  );
};

export default AdminUserManagement;
