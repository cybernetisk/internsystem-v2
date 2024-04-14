import React, { useState, useEffect } from 'react';

export default function Instagram () {
  
  const [images, setImages] = useState([]);
  const token = "";

  useEffect(() => {
    fetch('https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=' + token)
      .then(response => response.json())
      .then(data => {
        setImages(data.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      {images.map(image => (
        <div key={image.id}>
          {
            image.media_type === 'IMAGE' &&
            <img src={image.media_url} alt={image.caption} />
          }
          {
            image.media_type === 'VIDEO' &&
            <video src={image.media_url} alt={image.caption} controls />
          }

          <p>{image.caption}</p>
        </div>
      ))}
    </div>
  );
};
