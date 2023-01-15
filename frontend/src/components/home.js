import React from 'react'
import { Link } from 'react-router-dom';
function Home() {
  return (
    <>
    <div>create course</div>
    <h3><Link to="/course/create">create course</Link></h3>
    </>
  )
}

export default Home