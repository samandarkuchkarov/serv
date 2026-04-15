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
  Switch,
  Select,
} from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useNavigate, useParams } from 'react-router-dom';
import { constructorApi } from '../../api/constructor';
import RichTextEditor from '../../components/RichTextEditor';

const { Title } = Typography;

const PAGE_OPTIONS = [
  { value: 'internet', label: 'Интернет' },
  { value: 'fiz', label: 'Физ. лицо' },
  { value: 'teh', label: 'Техподдержка' },
  { value: 'yur', label: 'Юр. лицо' },
  { value: 'data', label: 'Data' },
  { value: 'iptv', label: 'IPTV' },
  { value: 'equipments', label: 'Оборудование' },
  { value: 'other', label: 'Другое' },
  { value: 'both', label: 'Оба' },
];

export default function ItemFormPage() {
  const { sectionId, id } = useParams<{ sectionId?: string; id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Rich text fields managed outside Ant Design Form
  const [shortTextUz, setShortTextUz] = useState('');
  const [shortTextRu, setShortTextRu] = useState('');
  const [descriptionUz, setDescriptionUz] = useState('');
  const [descriptionRu, setDescriptionRu] = useState('');
  const [seoUz, setSeoUz] = useState('');
  const [seoRu, setSeoRu] = useState('');

  const [imageList, setImageList] = useState<UploadFile[]>([]);
  const [imageUzList, setImageUzList] = useState<UploadFile[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentImageUz, setCurrentImageUz] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    constructorApi.getAll().then((sections) => {
      const item = sections.flatMap((s) => s.items).find((i) => i.id === id);
      if (!item) {
        message.error('Элемент не найден');
        navigate('/constructor');
        return;
      }
      form.setFieldsValue({
        title_uz: item.title_uz,
        title_ru: item.title_ru,
        access_only_by_url: item.access_only_by_url,
        is_visible: item.is_visible,
        is_archived: item.is_archived,
        page: item.page ?? undefined,
        cities: item.cities,
      });
      setShortTextUz(item.short_text_uz ?? '');
      setShortTextRu(item.short_text_ru ?? '');
      setDescriptionUz(item.description_uz ?? '');
      setDescriptionRu(item.description_ru ?? '');
      setSeoUz(item.seo_uz ?? '');
      setSeoRu(item.seo_ru ?? '');
      setCurrentImage(item.image);
      setCurrentImageUz(item.image_uz);
      setFetching(false);
    });
  }, [id]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();

      const {
        access_only_by_url,
        is_visible,
        is_archived,
        cities,
        page,
        ...rest
      } = values;

      Object.entries(rest).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, String(val));
        }
      });

      formData.append(
        'access_only_by_url',
        String(access_only_by_url ?? false),
      );
      formData.append('is_visible', String(is_visible ?? true));
      formData.append('is_archived', String(is_archived ?? false));

      if (page) formData.append('page', page);

      if (cities && cities.length > 0) {
        cities.forEach((city: string) => formData.append('cities', city));
      }

      if (shortTextUz) formData.append('short_text_uz', shortTextUz);
      if (shortTextRu) formData.append('short_text_ru', shortTextRu);
      if (descriptionUz) formData.append('description_uz', descriptionUz);
      if (descriptionRu) formData.append('description_ru', descriptionRu);
      if (seoUz) formData.append('seo_uz', seoUz);
      if (seoRu) formData.append('seo_ru', seoRu);

      if (imageList[0]?.originFileObj) {
        formData.append('image', imageList[0].originFileObj);
      }
      if (imageUzList[0]?.originFileObj) {
        formData.append('image_uz', imageUzList[0].originFileObj);
      }

      setLoading(true);
      if (isEdit) {
        await constructorApi.updateItem(id!, formData);
        message.success('Элемент обновлён');
      } else {
        await constructorApi.createItem(sectionId!, formData);
        message.success('Элемент создан');
      }
      navigate('/constructor');
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
    <div style={{ maxWidth: 900 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/constructor')}
        />
        <Title level={4} style={{ margin: 0 }}>
          {isEdit ? 'Редактировать элемент' : 'Добавить элемент'}
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          access_only_by_url: false,
          is_visible: true,
          is_archived: false,
        }}
      >
        <Row gutter={16}>
          {/* Titles */}
          <Col span={12}>
            <Form.Item
              name="title_uz"
              label="Заголовок UZ"
              rules={[{ required: true, message: 'Обязательное поле' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="title_ru"
              label="Заголовок RU"
              rules={[{ required: true, message: 'Обязательное поле' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          {/* Short text */}
          <Col span={24}>
            <Form.Item label="Краткий текст UZ">
              <RichTextEditor value={shortTextUz} onChange={setShortTextUz} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Краткий текст RU">
              <RichTextEditor value={shortTextRu} onChange={setShortTextRu} />
            </Form.Item>
          </Col>

          {/* Description */}
          <Col span={24}>
            <Form.Item label="Описание UZ">
              <RichTextEditor
                value={descriptionUz}
                onChange={setDescriptionUz}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Описание RU">
              <RichTextEditor
                value={descriptionRu}
                onChange={setDescriptionRu}
              />
            </Form.Item>
          </Col>

          {/* SEO */}
          <Col span={24}>
            <Form.Item label="SEO UZ">
              <RichTextEditor value={seoUz} onChange={setSeoUz} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="SEO RU">
              <RichTextEditor value={seoRu} onChange={setSeoRu} />
            </Form.Item>
          </Col>

          {/* Page type */}
          <Col span={12}>
            <Form.Item name="page" label="Страница">
              <Select
                allowClear
                placeholder="Не выбрано"
                options={PAGE_OPTIONS}
              />
            </Form.Item>
          </Col>

          {/* Cities */}
          <Col span={12}>
            <Form.Item name="cities" label="Города">
              <Select
                mode="multiple"
                placeholder="Выберите города"
                style={{ width: '100%' }}
                options={[
                  { value: 'Ташкент', label: 'Ташкент' },
                  { value: 'Фергана', label: 'Фергана' },
                ]}
              />
            </Form.Item>
          </Col>

          {/* Toggles */}
          <Col span={8}>
            <Form.Item
              name="access_only_by_url"
              label="Доступно только по ссылке"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="is_visible" label="Виден" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="is_archived"
              label="В архиве"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>

          {/* Image (main) */}
          <Col span={12}>
            <Form.Item label="Изображение (RU)">
              {isEdit && currentImage && imageList.length === 0 && (
                <Image
                  src={`${import.meta.env.VITE_API_URL}/uploads/constructor/${currentImage}`}
                  height={80}
                  style={{
                    objectFit: 'cover',
                    borderRadius: 4,
                    marginBottom: 8,
                    display: 'block',
                  }}
                />
              )}
              <Upload
                beforeUpload={() => false}
                fileList={imageList}
                onChange={({ fileList: fl }) => setImageList(fl.slice(-1))}
                accept="image/*"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Выбрать изображение</Button>
              </Upload>
            </Form.Item>
          </Col>

          {/* Image UZ */}
          <Col span={12}>
            <Form.Item label="Изображение (UZ)">
              {isEdit && currentImageUz && imageUzList.length === 0 && (
                <Image
                  src={`${import.meta.env.VITE_API_URL}/uploads/constructor/${currentImageUz}`}
                  height={80}
                  style={{
                    objectFit: 'cover',
                    borderRadius: 4,
                    marginBottom: 8,
                    display: 'block',
                  }}
                />
              )}
              <Upload
                beforeUpload={() => false}
                fileList={imageUzList}
                onChange={({ fileList: fl }) => setImageUzList(fl.slice(-1))}
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
          <Button onClick={() => navigate('/constructor')}>Отмена</Button>
        </div>
      </Form>
    </div>
  );
}
