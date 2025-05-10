import React, { useEffect, useState } from 'react'
import axios from 'axios'

const UserManagement = () => {
const [user,setUser] = useState([]);
const [posts, setPosts] = useState([]);
const [postList, setPostList] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8000/getallusers', {
        withCredentials: true
    })
        .then((response) => {
              // console.log(response.data);
            setUser(response.data)
        })
        .catch((error) => {
            console.error("Error fetching users:", error);
        });
}, [])

useEffect(() => {
  axios.get('http://localhost:8000/getallposts', { withCredentials: true })
      .then((response) => {
          // console.log(response.data)
          setPosts(response.data)
      })
      .catch((error) => {
          console.error("error fetching posts:", error);
      })
}, [])


  // http://localhost:8000/api/v1/users
  return (
    <>

      <div className="container">

        <div className='m-8'>
          <h1 className='text-2xl font-bold'> User Management </h1>
        </div>

        <div className="w-full m-8 place-content-start">
          <form class="max-w-md ">
            <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div class="relative">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search User by name" required />
              <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
            </div>
          </form>
        </div>


        <div class="relative m-8 overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">
                  User name
                </th>
                <th scope="col" class="px-6 py-3">
                  Role
                </th>
                <th scope="col" class="px-6 py-3">
                  Joining Date
                </th>
                <th scope="col" class="px-6 py-3">
                  Email
                </th>
                <th scope="col" class="px-6 py-3">
                  Posts
                </th>
                <th scope="col" class="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {
                user.map((data,key)=>(

              <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {data.name}
                </th>
                <td class="px-6 py-4">
                {data.headline}
                </td>
                <td class="px-6 py-4">
                {new Date(data.createdAt).toLocaleDateString('en-GB')}
                </td>
                <td class="px-6 py-4">
                {data.email}
                </td>
                <td class="px-6 py-4">
                {
    posts.filter(post => post.author === data._id).length
  }
                </td>
                <td class="px-6 py-4">
                  <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</a>
                </td>
              </tr>
                ))
              }
            </tbody>
          </table>
        </div>

      </div>

    </>
  )
}

export default UserManagement