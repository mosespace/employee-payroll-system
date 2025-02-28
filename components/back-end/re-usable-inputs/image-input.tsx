import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { UploadButton } from '@/utils/uploadthing';
import { Download, Eye, File, FileText, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type FileInputProps = {
  title: string;
  fileUrl: string;
  setFileUrl: (url: string) => void;
  endpoint: any;
  maxSizeMB?: number;
  description?: string;
};

const FileInput = ({
  title,
  fileUrl,
  setFileUrl,
  endpoint,
  maxSizeMB = 1,
  description,
}: FileInputProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  const isImage = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const isPDF = (url: string) => {
    return url.toLowerCase().endsWith('.pdf');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRemoveFile = () => {
    setFileUrl('');
    setFileSize(null);
    setFileType(null);
  };

  const FilePreviewCard = ({ url, type }: { url: string; type: string }) => (
    <div className="relative rounded-md border bg-white p-4 shadow-sm">
      <div className="absolute right-2 top-2 flex space-x-2">
        <button
          onClick={() => window.open(url, '_blank')}
          className="rounded-full bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200"
          title="View file"
        >
          <Eye className="h-4 w-4" />
        </button>
        <a
          href={url}
          download
          className="rounded-full bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200"
          title="Download file"
        >
          <Download className="h-4 w-4" />
        </a>
        <button
          onClick={handleRemoveFile}
          className="rounded-full bg-red-100 p-1.5 text-red-600 hover:bg-red-200"
          title="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-start space-x-4">
        {type === 'pdf' ? (
          <FileText className="h-10 w-10 text-red-500" />
        ) : type === 'image' ? (
          <div className="h-10 w-10 overflow-hidden rounded">
            <Image
              src={url}
              alt="Preview"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <File className="h-10 w-10 text-primary" />
        )}

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            {url.split('/').pop()}
          </p>
          <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
            {fileSize && <span>{formatFileSize(fileSize)}</span>}
            {fileType && <span>• {fileType}</span>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => {
    if (!fileUrl) return null;

    if (isLoading) {
      return (
        <div className="flex h-40 w-full items-center justify-center rounded-md bg-gray-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="text-sm text-gray-500">Uploading file...</span>
          </div>
        </div>
      );
    }

    const type = isImage(fileUrl) ? 'image' : isPDF(fileUrl) ? 'pdf' : 'other';
    return <FilePreviewCard url={fileUrl} type={type} />;
  };

  return (
    <Card className="overflow-hidden rounded-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {fileUrl && renderPreview()}
          <div className="relative">
            {/* <UploadButton
              className="mt-4 ut-button:!cursor-pointer ut-button:bg-primary ut-label:text-white ut-label:hover:text-brandBlack/50 ut-button:ut-readying:bg-orange-600/50"
              endpoint={endpoint}
              onUploadBegin={() => {
                setIsLoading(true);
              }}
              onClientUploadComplete={(res) => {
                console.log('Files: ', res);
                setFileUrl(res[0].url);
                setFileSize(res[0].size);
                setFileType(res[0].type);
                setIsLoading(false);
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
                setIsLoading(false);
              }}
            /> */}
            <p className="mt-2 text-xs text-gray-500">
              Maximum file size: {maxSizeMB}MB
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileInput;
