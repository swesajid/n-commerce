import dynamic from 'next/dynamic';
import { FC } from 'react';
import { dataURItoBlob } from '../utils/image.util';
import 'suneditor/dist/css/suneditor.min.css';
import { Typography } from '@mui/material';
import { ErrorMessage } from 'formik';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const EDITOR_BUTTONLIST = [
    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
    ['font', 'align', 'fontSize', 'fontColor', 'hiliteColor'],
    ['table', 'list', 'lineHeight'],
    ['link', 'image'],
    ['paragraphStyle', 'blockquote'],
];

const SunEditor = dynamic(() => import('suneditor-react'), {
    ssr: false,
});

interface iProps {
    formProps: any;
    field_name: string;
    value?: string;
    label: string;
}

const RichTextEditor: FC<iProps> = (props) => {
    const { formProps, field_name, value, label } = props;
    const handleImageUpload = async (
        targetImgElement: HTMLImageElement,
        index: any,
        state: any,
        imageInfo: any,
        remainingFilesCount: any
    ) => {
        if (!targetImgElement) return;
        const formData = new FormData();
        formData.append('upload', dataURItoBlob(imageInfo.src));
        formData.append('imageName', imageInfo.name);

        const token = localStorage.getItem('skon-auth-token') as string;
        const res = await fetch(`${API_BASE}/upload-image`, {
            method: 'POST',
            headers: { 'skon-auth-token': token },
            body: formData,
        });
        const data = await res.json();

        if (res.status !== 201) return;

        targetImgElement.src = data.imageUrl;
    };
    return (
        <div>
            <Typography variant="body1">{label} </Typography>
            <SunEditor
                placeholder="Type Here ..."
                setOptions={{
                    buttonList: EDITOR_BUTTONLIST,
                    minHeight: '400px',
                }}
                onImageUpload={handleImageUpload}
                onChange={(content: string) => {
                    if (content === '<p><br></p>') return;
                    formProps.setFieldValue(field_name, content);
                }}
                defaultValue={value ? value : ''}
            />
            <ErrorMessage
                name={field_name}
                render={(errorMessage: string) => (
                    <div style={{ color: 'red' }}>
                        <small>{errorMessage}</small>
                    </div>
                )}
            />
        </div>
    );
};

export default RichTextEditor;
