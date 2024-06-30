import React, { useEffect } from 'react'
import { useSelector } from 'src/app/hooks'
import { useRouter } from 'next/router'
import ManageUserComponent from 'src/components/admin/manage-user'
import FileCollectionsComponent from 'src/components/user/file-collections'

const Dashboard = () => {
  const router = useRouter();

  const isLoggedIn = useSelector((state) => state.localStorage.userState.isLoggedIn);
  const role = useSelector((state) => state.localStorage.userState.user?.role);

  useEffect(() => {
    if (!isLoggedIn) router.push("/auth/login");
  }, [])


  return (
    <div>
      {role === 'ADMIN'
        ? (
          <ManageUserComponent />
        )
        : (
          <FileCollectionsComponent />
        )}
    </div>
  )
}

export default Dashboard
