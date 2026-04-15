import { useEffect, useState } from 'react';
import {
  Form, Input, Upload, Button, Row, Col,
  message, Image, Typography, Spin, Switch,
} from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useNavigate, useParams } from 'react-router-dom';
import { serviceApi } from '../../api/service';

const { Title } = Typography;

export default function ServiceFormPage() {
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
    serviceApi.getOne(id!).then((service) => {
      form.setFieldsValue({
        title_uz: service.title_uz,
        title_ru: service.title_ru,
        descr_uz: service.descr_uz,
        descr_ru: service.descr_ru,
        btn_name_uz: service.btn_name_uz,
        btn_name_ru: service.btn_name_ru,
        btn_link: service.btn_link,
        freebtn_uz: service.freebtn_uz,
        freebtn_ru: service.freebtn_ru,
        more_link: service.more_link,
        morename_uz: service.morename_uz,
        morename_ru: service.morename_ru,
        is_visible: service.is_visible,
      });
      setCurrentImage(service.image);
      setFetching(false);
    }).catch(() => {
      message.error('Услуга не найдена');
      navigate('/services');
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
      const { is_visible, ...rest } = values;
      Object.entries(rest).forEach(([key, val]) => {
        if (val !== undefined && val !== null) formData.append(key, String(val));
      });
      formData.append('is_visible', String(is_visible ?? true));
      if (fileList[0]?.originFileObj) formData.append('image', fileList[0].originFileObj);

      setLoading(true);
      if (isEdit) {
        await serviceApi.update(id!, formData);
        message.success('Услуга обновлена');
      } else {
        await serviceApi.create(formData);
        message.success('Услуга создана');
      }
      navigate('/services');
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error('Что-то пошло не так');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spin style={{ display: 'block', margin: '80px auto' }} />;

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/services')} />
        <Title level={4} style={{ margin: 0 }}>
          {isEdit ? 'Редактировать услугу' : 'Добавить услугу'}
        </Title>
      </div>

      <Form form={form} layout="vertical" initialValues={{ is_visible: true }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="title_uz" label="Название UZ" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="title_ru" label="Название RU" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="descr_uz" label="Описание UZ" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="descr_ru" label="Описание RU" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="btn_name_uz" label="Кнопка UZ" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="btn_name_ru" label="Кнопка RU" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="btn_link" label="Ссылка кнопки" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input placeholder="https://" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="freebtn_uz" label="Бесплатная кнопка UZ" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="freebtn_ru" label="Бесплатная кнопка RU" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="morename_uz" label="Подробнее UZ" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="morename_ru" label="Подробнее RU" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="more_link" label="Ссылка «Подробнее»" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input placeholder="https://" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="is_visible" label="Видимость" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={isEdit ? 'Изображение (оставьте пустым чтобы сохранить текущее)' : 'Изображение'}>
              {isEdit && currentImage && fileList.length === 0 && (
                <Image
                  src={`${import.meta.env.VITE_API_URL}/uploads/services/${currentImage}`}
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
          <Button onClick={() => navigate('/services')}>Отмена</Button>
        </div>
      </Form>
    </div>
  );
}
