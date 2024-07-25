import React, { useState, useEffect } from 'react';
import './Portfolio.css';
import { useDispatch } from 'react-redux';
import { getPortfolio } from '../../actions/portfolio';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { FaDiagramProject } from "react-icons/fa6";
import { useRedirectToLogin } from '../../customHooks/useRedirectToLogin';

function Portfolio() {
  const [allProjects, setAllProjects] = useState([{name : "name",leader:"leader",about:"about"}]);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const posts = useSelector((state) => state.portfolio);

  useRedirectToLogin();

  // Corrected function to handle the click event with the project ID
  const handleSubmit = (id) => {
    console.log(id)
    navigate(`/Buy/${id}`);
  };

  useEffect(() => {
    dispatch(getPortfolio());
  }, [dispatch]);

  useEffect(() => {
    // Updated to set allProjects to the entire posts array
    if(posts.length > 0) {
    setAllProjects(posts[0]);
    }
  }, [posts]);

  return (
    <div>
      <div className='portfolio-section'>
        {allProjects.map((project) => (
          <div key={project.id} onClick={() => handleSubmit(project._id)} className='portfolio-card'>
            <div className='card-content'>
              <div><FaDiagramProject/></div>
              <div><h4 className='card-heading'>Project Name</h4> : {project.name}</div>
            </div>
            <div className='card-content'>
              <div><FaUserCircle/></div>
              <div><h4 className='card-heading'>Team Leader</h4> : {project.leader}</div>
            </div>
            <div className='card-content'>
              <div><GiReceiveMoney/></div>
              <div><h4 className='card-heading'>Stocks Left</h4> : {project.stock}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



export default Portfolio
