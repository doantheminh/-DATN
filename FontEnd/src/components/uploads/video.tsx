import { Dispatch, FC, SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import { Button, Input, message } from 'antd';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import axios from 'axios';

interface Props {
    videos?: string[];
    setVideos: Dispatch<SetStateAction<string[]>>;
}

const UploadVideoServer: FC<Props> = ({ setVideos, videos }) => {
    const [fileList, setFileList] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        setUploading(true);

        try {
            const formData = new FormData();

            for (const file of fileList) {
                formData.append('file', file);
                formData.append('upload_preset', 'upload_angular');
                formData.append('clound_name', 'dh96qogra');
                const { data } = await axios.post('https://api.cloudinary.com/v1_1/dh96qogra/video/upload', formData);
                const url = data.url;
                setVideos((prev) => [...prev, url]);
            }

            message.success('Đăng video thành công');
        } catch (error) {
            message.error('upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        const files = target.files!;

        for (const file of files) {
            const preview = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });
            setFileList((prev) => [...prev, preview]);
        }
        setVideos([]);
    };

    const removeFile = (index: number) => {
        setFileList((prev) => prev.filter((_item, i) => i !== index));
    };

    useEffect(() => {
        // Auto-upload when fileList changes
        if (fileList.length > 0) {
            handleUpload();
        }
    }, [fileList]); // Trigger effect when fileList changes

    useEffect(() => {
        return () => fileList.forEach((file) => URL.revokeObjectURL(file.preview));
    }, []);

    return (
        <>
            <Input onChange={(e) => handleChange(e)} type="file" accept="video/*" multiple />
            <div className="flex gap-x-2 mt-4">
                {videos?.length! > 0
                    ? videos?.map((video, i) => (
                          <div key={i} className="w-20 h-20 shadow relative">
                              {/* Your video preview */}
                              <video className="w-full h-full" controls>
                                  <source src={video} type="video/mp4" />
                              </video>
                              {/* Your close button */}
                          </div>
                      ))
                    : fileList &&
                      fileList.map((preview, i) => (
                          <div key={i} className="w-20 h-20 shadow relative">
                              {/* Your video preview */}
                              <video className="w-full h-full" controls>
                                  <source src={preview.preview} type="video/mp4" />
                              </video>
                              {/* Your close button */}
                          </div>
                      ))}
            </div>
            <Button
                htmlType="button"
                type="default"
                onClick={handleUpload}
                disabled={fileList?.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}
            >
                {uploading ? 'Uploading' : 'Start Upload'}
            </Button>
        </>
    );
};

export default UploadVideoServer;
