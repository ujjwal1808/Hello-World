import React, { useEffect, useState } from 'react'
import { Users } from 'lucide-react';
import axios from 'axios';

const Home = () => {
    const [user, setUser] = useState([])
    const [posts, setPosts] = useState([])
    // console.log(new Date("2024-11-06T06:44:45.033Z").toLocaleDateString('en-GB'));

    useEffect(() => {
        axios.get('http://localhost:8000/getallusers', {
            withCredentials: true
        })
            .then((response) => {
                  console.log(response.data); 
                setUser(response.data)
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8000/getallposts', { withCredentials: true })
            .then((response) => {
                console.log(response.data)
                setPosts(response.data)
            })
            .catch((error) => {
                console.error("error fetching posts:", error);
            })
    }, [])

    return (
        <>
            <div className="justify-end w-fit m-10">
                <div className=" p-6 flex justify-between h-fit">
                    <div className="bg-white p-6 rounded-lg shadow-sm w-1/4">
                        <Users />
                        <h2 className="text-xl font-semibold mb-4">
                            {user.length}
                        </h2>
                        <p className="text-gray-600">
                            Total Users
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm w-1/4">
                        <Users />
                        <h2 className="text-xl font-semibold mb-4">
                            {posts.length}
                        </h2>
                        <p className="text-gray-600">
                            Total Posts
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm w-1/4">
                        <Users />
                        <h2 className="text-xl font-semibold mb-4">
                            1
                        </h2>
                        <p className="text-gray-600">
                            Total Admin
                        </p>
                    </div>
                </div>



                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                                    User email
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Joined date
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    <span class="sr-only">View</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                user.map((data, key) => 
                                    (
                                        <>
                                            <tr key={key} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {data.name}
                                                </th>
                                                <td class="px-6 py-4">
                                                    {data.headline}
                                                </td>
                                                <td class="px-6 py-4">
                                                    {data.email}
                                                </td>
                                                <td class="px-6 py-4">
                                                {new Date(data.createdAt).toLocaleDateString('en-GB')}
                                                </td>
                                                <td class="px-6 py-4 text-right">
                                                    <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                                </td>
                                            </tr>
                                        </>
                                    )
                                )
                            }

                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}

export default Home