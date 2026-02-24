'use client';

import Image from 'next/image';
import React from 'react';

interface ObsidianImageProps {
  src: string;
  alt: string;
}

export function ObsidianImage({ src, alt }: ObsidianImageProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className='my-6'>
      <Image
        src={`/static/images/${src}`}
        alt={alt}
        width={800}
        height={600}
        className='rounded-lg'
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </div>
  );
}
