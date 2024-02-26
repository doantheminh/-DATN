import { Dispatch, FC, SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Button, Image, Input, message } from 'antd';
import axios from 'axios';

interface Props {
    images?: string[];
    setImages: Dispatch<SetStateAction<string[]>>;
}

const UploadFileServer: FC<Props> = ({ setImages, images }) => {
    const [fileList, setFileList] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (files: File[]) => {
        setUploading(true);

        try {
            const formData = new FormData();

            for (const file of files) {
                formData.append('file', file);
                formData.append('upload_preset', 'upload_angular');
                formData.append('clound_name', 'dh96qogra');
                const { data } = await axios.post('https://api.cloudinary.com/v1_1/dh96qogra/image/upload', formData);
                const url = data.url;
                setImages((prev) => [...prev, url]);
            }

            message.success('Đăng ảnh thành công');
        } catch (error) {
            message.error('upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        const files = target.files!;

        const fileArray = Array.from(files);
        setFileList(fileArray);

        handleUpload(fileArray);
    };

    const removeFile = (index: number) => {
        setFileList((prev) => prev.filter((_item, i) => i !== index));
    };

    useEffect(() => {
        // Make sure to revoke the data URIs to avoid memory leaks, will run on unmount
        return () => fileList.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [fileList]);

    return (
        <>
            <Input onChange={(e) => handleChange(e)} type="file" multiple />
            <div className="flex gap-x-2 mt-4">
                {images?.length! > 0
                    ? images?.map((img, i) => (
                          <div key={i} className="w-20 h-20 shadow relative">
                              <Image className="w-full h-full" preview src={img} />
                              <span
                                  onClick={() => removeFile(i)}
                                  className="absolute -top-2 z-50 cursor-pointer -right-2 text-xl text-red-500"
                              >
                                  <AiOutlineCloseCircle />
                              </span>
                          </div>
                      ))
                    : fileList &&
                      fileList.map((preview, i) => (
                          <div key={i} className="w-20 h-20 shadow relative">
                              <Image
                                  className="w-full h-full"
                                  preview
                                  src={URL.createObjectURL(preview)}
                                  onLoad={() => {
                                      URL.revokeObjectURL(preview.preview);
                                  }}
                              />
                              <span
                                  onClick={() => removeFile(i)}
                                  className="absolute -top-2 z-50 cursor-pointer -right-2 text-xl text-red-500"
                              >
                                  <AiOutlineCloseCircle />
                              </span>
                          </div>
                      ))}
            </div>
            <Button
                htmlType="button"
                type="default"
                disabled={uploading}
                style={{ marginTop: 16 }}
            >
                {uploading ? 'Uploading' : 'Start Upload'}
            </Button>
        </>
    );
};

export default UploadFileServer;
