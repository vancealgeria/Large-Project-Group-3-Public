import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext";
import { deletePost, getUserPosts } from "../../controllers/activitiesController";
import Post from "../../Components/Post";
import Alert from "../../Components/Alert";
import Success from "../../Components/Success";
const Record = () => {

    return(
    <section className="card">
      <div className="flex flex-col items-center justify-center">
      <p style={{ fontSize: '50px' }}><b>CHOSE YOUR ACTIVITY</b></p>
      <br/>
      
        <div className="flex items-center gap-4">
              <Link
                title="Record Work"
                to="/work"
                className="nav-link px-1 py-1"
                
              >WORK</Link>

              <Link
                title="Record Leisure"
                to="/leisure"
                className="nav-link px-1 py-1"
                
              >LEISURE</Link>

              <Link
                title="Record Sleep"
                to="/sleep"
                className="nav-link px-1 py-1"
                
              >SLEEP</Link>
          </div>
        </div>
        

    </section>
    )
}
export default Record;
