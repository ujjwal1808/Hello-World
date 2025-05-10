import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
];


const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};



const PostContent = () => {
  const [user, setUser] = useState([]);

  const [posts, setPosts] = useState([])

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

      <div className="container">

        <div className='m-8'>
          <h1 className='text-2xl font-bold'> Post Management </h1>
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
              <tr className='text-center'>
                <th scope="col" class="px-6 py-3">
                  Post ID
                </th>
                <th scope="col" class="px-6 py-3">
                  Content Preview
                </th>
                <th scope="col" class="px-6 py-3">
                  Author
                </th>
                <th scope="col" class="px-6 py-3">
                  Posted Date
                </th>
                <th scope="col" class="px-6 py-3">
                  Action
                </th>
                <th scope="col" class="px-6 py-3">
                  Send Alert
                </th>

              </tr>
            </thead>
            <tbody>
              {
                posts.map((data, key) => (

                  <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 text-center">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {data._id}
                    </th>
                    <td class="px-6 py-4 justify-items-center">
                      {
                        data.image ? <img src={data.image} alt="" width={70} /> : data.content
                      }
                      
                    </td>
                    <td class="px-6 py-4">
                      

                      {
                        user.find(user => user._id === data.author).name
                      }
                    </td>
                    <td class="px-6 py-4">
                      {new Date(data.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td class="px-6 py-4">
                      <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</a>
                    </td>
                    <td class="px-6 py-4">
                      <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline"> Alert</a>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        <div className="m-8 border border-gray-100 rounded-lg shadow-md  w-fit p-5">
          <h1 className='text-lg font-semibold'>Content Distribution</h1>
          <div className='flex items-center gap-10'>
            <ResponsiveContainer width={200} height={200}>
              <PieChart width={200} height={200}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div >
              <div className='flex items-center'>
                <div className="w-4 h-4 rounded-full bg-[#0088FE] mr-2"></div> Images
              </div>

              <div className='flex items-center'>
                <div className="w-4 h-4 rounded-full bg-[#00C49F] mr-2"></div> Video
              </div>

              <div className='flex items-center'>
                <div className="w-4 h-4 rounded-full bg-[#FFBB28] mr-2"></div> Text
              </div>

            </div>

          </div>
        </div>


      </div>

    </>
  )
}

export default PostContent