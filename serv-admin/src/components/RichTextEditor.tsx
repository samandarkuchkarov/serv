import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  List,
  Indent,
  BlockQuote,
  Heading,
  Paragraph,
  Essentials,
  Undo,
  Table,
  TableToolbar,
  FontColor,
  FontBackgroundColor,
  FontSize,
  FontFamily,
  Alignment,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  ImageInsert,
  Base64UploadAdapter,
  SourceEditing,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value ?? ''}
      config={{
        licenseKey: 'GPL',
        plugins: [
          Essentials,
          Paragraph,
          Heading,
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Link,
          List,
          Indent,
          BlockQuote,
          Table,
          TableToolbar,
          FontColor,
          FontBackgroundColor,
          FontSize,
          FontFamily,
          Alignment,
          Undo,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageResize,
          ImageInsert,
          Base64UploadAdapter,
          SourceEditing,
        ],
        toolbar: {
          items: [
            'heading',
            '|',
            'fontFamily',
            'fontSize',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            '|',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'alignment',
            '|',
            'bulletedList',
            'numberedList',
            'indent',
            'outdent',
            '|',
            'link',
            'blockQuote',
            'insertTable',
            'insertImage',
            '|',
            'undo',
            'redo',
            '|',
            'sourceEditing',
          ],
        },
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
        },
        image: {
          toolbar: [
            'imageStyle:inline',
            'imageStyle:block',
            'imageStyle:side',
            '|',
            'toggleImageCaption',
            'imageTextAlternative',
            '|',
            'resizeImage',
          ],
        },
        fontSize: {
          options: [10, 12, 14, 'default', 18, 20, 24, 28, 32, 36],
        },
        fontFamily: {
          options: [
            'default',
            'Arial, Helvetica, sans-serif',
            'Georgia, serif',
            'Courier New, Courier, monospace',
            'Tahoma, Geneva, sans-serif',
            'Trebuchet MS, Helvetica, sans-serif',
            'Times New Roman, Times, serif',
          ],
        },
      }}
      onChange={(_event, editor) => {
        onChange?.(editor.getData());
      }}
    />
  );
}
