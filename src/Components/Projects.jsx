import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Import your projects.json file
import projects from '../Content/projects.json';

import ButtonAppBar from './Header';

export default function Projects() {
  const [showContentIdx, setShowContentIdx] = useState(null);

  const handleToggleContent = (idx) => {
    setShowContentIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <>
      <ButtonAppBar />
      <div
        className="speed-dial"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          flexDirection: 'column',
          flexFlow: 'wrap',
          columnCount: '3',
          gap: '20px',
          alignContent: 'center',
          textAlign: 'center',
          alignmentBaseline: 'middle',
          overflowY: 'auto',
          overflowX: 'auto',
          padding: '20px',
          marginTop: '70px',
        }}
      >
        {projects.map((project, idx) => (
          <Box key={project.githubName}>
            <img
              src={project.githubImg}
              alt={project.githubName}
              style={{ cursor: 'pointer', width: 80 }}
              onClick={() => handleToggleContent(idx)}
            />
            <h2
              style={{ cursor: 'pointer', margin: '10px 0' }}
              onClick={() => handleToggleContent(idx)}
            >
              {project.githubName}
            </h2>
            {showContentIdx === idx && (
              <>              <a href={'https://github.com/moodynooby/'+project.githubName}>Github</a>
              <MarkdownContent url={project.githubContentPath} />
</>
            )}
          </Box>
        ))}
      </div>
      <h2 style={{textAlign:'center'}}>And Much More...</h2>
    </>
  );

  // Helper component to fetch and render markdown
  function MarkdownContent({ url }) {
    const [content, setContent] = useState('');
    useEffect(() => {
      fetch(url)
        .then((res) => res.text())
        .then(setContent)
        .catch(() => setContent('Failed to load content.'));
    }, [url]);
    return (
      <pre
        style={{
          textAlign: 'left',
          maxWidth: '80vw',
          maxHeight: '80vh',
          overflowX: 'auto',
          padding: 10,
          borderRadius: 4,
        }}
      >
        {content}
      </pre>
    );
  }

  MarkdownContent.propTypes = {
    url: PropTypes.string.isRequired,
  };
}
