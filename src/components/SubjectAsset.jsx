import React from 'react';

/**
 * The hero's subject asset: a portrait photograph.
 */
const SubjectAsset = ({ image, alt }) => {
  return (
    <div className="relative mx-auto w-full max-w-[16rem] sm:max-w-[20rem] md:max-w-[22rem] lg:max-w-[27rem] xl:max-w-[29rem]">
      <div className="relative aspect-[4/5] w-full">
        <img
          src={image}
          alt={alt}
          width={800}
          height={800}
          loading="eager"
          decoding="async"
          className="h-full w-full origin-[50%_32%] scale-[1.03] object-cover opacity-80"
        />

        <div
          aria-hidden="true"
          className="subject-mask pointer-events-none absolute inset-0 bg-accent opacity-[0.12] mix-blend-overlay"
          style={{ '--subject-mask-image': `url(${image})` }}
        />
      </div>
    </div>
  );
};

export default SubjectAsset;