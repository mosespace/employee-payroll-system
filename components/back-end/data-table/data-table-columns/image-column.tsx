import { siteConfig } from '@/constants/site';
import Image from 'next/image';
import React from 'react';

export default function ImageColumn({
  row,
  accessorKey,
}: {
  row: any;
  accessorKey: any;
}) {
  const imageUrl = row.getValue(`${accessorKey}`);
  // const thumbnail = row.getValue(`${accessorKey}`);
  // console.log(imageUrl);
  return (
    <div className="shrink-0 items-center justify-center hidden md:flex">
      <Image
        alt={`${accessorKey}` || siteConfig.name}
        className="aspect-square w-12 h-12 rounded-md object-cover"
        height={400}
        src={
          imageUrl ??
          'https://1k60xyo2z1.ufs.sh/f/Guex3D2Xmynf7WoieQjfbY6mI5dQwEMhvJlRNt2uyKci1Gke'
        }
        width={400}
      />
    </div>
  );
}
