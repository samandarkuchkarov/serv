import { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Upload,
  Button,
  Row,
  Col,
  message,
  Image,
  Typography,
  Spin,
} from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useNavigate, useParams } from 'react-router-dom';
import { bannersApi } from '../../api/banners';

const { Title } = Typography;

export default function BannerFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    bannersApi.getAll().then((banners) => {
      const banner = banners.find((b) => b.id === id);
      if (!banner) {
        message.error('Баннер не найден');
        navigate('/banners');
        return;
      }
      form.setFieldsValue(banner);
      setCurrentImage(banner.image);
      setFetching(false);
    });
  }, [id]);

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
      if (isEdit) {
        await bannersApi.update(id, formData);
        message.success('Баннер обновлён');
      } else {
        await bannersApi.create(formData);
        message.success('Баннер создан');
      }
      navigate('/banners');
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error('Что-то пошло не так');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Spin style={{ display: 'block', margin: '80px auto' }} />;
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/banners')} />
        <Title level={4} style={{ margin: 0 }}>
          {isEdit ? 'Редактировать баннер' : 'Добавить баннер'}
        </Title>
      </div>

      <Form form={form} layout="vertical">
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
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="subtitle_ru" label="Подзаголовок RU" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input.TextArea rows={4} />
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
              {isEdit && currentImage && fileList.length === 0 && (
                <Image
                  src={`${import.meta.env.VITE_API_URL}/uploads/banners/${currentImage}`}
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

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Сохранить' : 'Создать'}
          </Button>
          <Button onClick={() => navigate('/banners')}>Отмена</Button>
        </div>
      </Form>
    </div>
  );
}
