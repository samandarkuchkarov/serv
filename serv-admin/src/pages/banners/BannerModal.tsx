import { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Upload,
  Button,
  Row,
  Col,
  message,
  Image,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { bannersApi } from '../../api/banners';
import type { Banner } from '../../types/banner';

interface Props {
  open: boolean;
  banner: Banner | null;
  onClose: () => void;
  onSaved: (banner: Banner, isNew: boolean) => void;
}

export default function BannerModal({ open, banner, onClose, onSaved }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const isEdit = !!banner;

  useEffect(() => {
    if (open) {
      if (banner) {
        form.setFieldsValue(banner);
      } else {
        form.resetFields();
      }
      setFileList([]);
    }
  }, [open, banner, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!isEdit && fileList.length === 0) {
        message.error('Загрузите изображение');
        return;
      }

      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, String(val));
        }
      });

      if (fileList[0]?.originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      }

      setLoading(true);
      const saved = isEdit
        ? await bannersApi.update(banner.id, formData)
        : await bannersApi.create(formData);

      message.success(isEdit ? 'Баннер обновлён' : 'Баннер создан');
      onSaved(saved, !isEdit);
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error('Что-то пошло не так');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Редактировать баннер' : 'Добавить баннер'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={isEdit ? 'Сохранить' : 'Создать'}
      cancelText="Отмена"
      confirmLoading={loading}
      width={720}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="title_uz" label="Заголовок UZ" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="title_ru" label="Заголовок RU" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="subtitle_uz" label="Подзаголовок UZ" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="subtitle_ru" label="Подзаголовок RU" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="btn_uz" label="Кнопка UZ" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="btn_ru" label="Кнопка RU" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="btn_link" label="Ссылка кнопки" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input placeholder="https://" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={isEdit ? 'Изображение (оставьте пустым чтобы сохранить текущее)' : 'Изображение'}>
              {isEdit && banner?.image && fileList.length === 0 && (
                <Image
                  src={`${import.meta.env.VITE_API_URL}/uploads/banners/${banner.image}`}
                  height={80}
                  style={{ objectFit: 'cover', borderRadius: 4, marginBottom: 8, display: 'block' }}
                />
              )}
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList: fl }) => setFileList(fl.slice(-1))}
                accept="image/*"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Выбрать изображение</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
