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
import { advantagesApi } from '../../api/advantages';

const { Title } = Typography;

export default function AdvantageFormPage() {
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
    advantagesApi.getAll().then((advantages) => {
      const advantage = advantages.find((a) => a.id === id);
      if (!advantage) {
        message.error('Преимущество не найдено');
        navigate('/advantages');
        return;
      }
      form.setFieldsValue(advantage);
      setCurrentImage(advantage.image);
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
        await advantagesApi.update(id, formData);
        message.success('Преимущество обновлено');
      } else {
        await advantagesApi.create(formData);
        message.success('Преимущество создано');
      }
      navigate('/advantages');
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
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/advantages')} />
        <Title level={4} style={{ margin: 0 }}>
          {isEdit ? 'Редактировать преимущество' : 'Добавить преимущество'}
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
          <Col span={24}>
            <Form.Item label={isEdit ? 'Изображение (оставьте пустым чтобы сохранить текущее)' : 'Изображение'}>
              {isEdit && currentImage && fileList.length === 0 && (
                <Image
                  src={`${import.meta.env.VITE_API_URL}/uploads/advantages/${currentImage}`}
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
          <Button onClick={() => navigate('/advantages')}>Отмена</Button>
        </div>
      </Form>
    </div>
  );
}
