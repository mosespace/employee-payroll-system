import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/constants/site';
// import { UploadButton } from '@/utils/uploadthing';
import Image from 'next/image';
import React from 'react';
type ImageInputProps = {
  title: string;
  imageUrls: string[];
  setImageUrls: any;
  endpoint: any;
};
export default function MultipleImageInput({
  title,
  imageUrls,
  setImageUrls,
  endpoint,
}: ImageInputProps) {
  // console.log(imageUrls);
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Image
            alt={title || siteConfig.name}
            className="h-30 rounded-md object-cover"
            height="80"
            src={imageUrls[0]}
            width="160"
          />
          <div className="grid grid-cols-3 gap-2">
            {imageUrls.map((imageUrl: string, i: number) => {
              return (
                <div key={i}>
                  <Image
                    alt="Product image"
                    className="h-30 aspect-square rounded-md object-cover"
                    height="80"
                    src={imageUrl}
                    width="80"
                  />
                </div>
              );
            })}
          </div>
          {/* <UploadButton
            className="mt-4 ut-button:!cursor-pointer ut-button:bg-brandColor ut-label:text-white ut-label:hover:text-brandBlack/50 ut-button:ut-readying:bg-orange-600/50"
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
              setImageUrls(res.map((item) => item.url));
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          /> */}
        </div>
      </CardContent>
    </Card>
  );
}
