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
  Table,
  Modal,
  Space,
} from 'antd';
import {
  UploadOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';
import { equipmentApi } from '../../api/equipment';
import type { MainChar } from '../../types/equipment';
import RichTextEditor from '../../components/RichTextEditor';

const { Title } = Typography;

export default function EquipmentFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [charForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentImg, setCurrentImg] = useState<string | null>(null);

  // Rich text fields
  const [infoUz, setInfoUz] = useState('');
  const [infoRu, setInfoRu] = useState('');
  const [descriptionUz, setDescriptionUz] = useState('');
  const [descriptionRu, setDescriptionRu] = useState('');
  const [seoUz, setSeoUz] = useState('');
  const [seoRu, setSeoRu] = useState('');

  // MainChars state
  const [chars, setChars] = useState<MainChar[]>([]);
  const [charModalOpen, setCharModalOpen] = useState(false);
  const [editingChar, setEditingChar] = useState<MainChar | null>(null);
  const [charLoading, setCharLoading] = useState(false);
  const [deletingCharId, setDeletingCharId] = useState<string | null>(null);
  const [deleteCharModalOpen, setDeleteCharModalOpen] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    equipmentApi.getAll().then((list) => {
      const equipment = list.find((e) => e.id === id);
      if (!equipment) {
        message.error('Оборудование не найдено');
        navigate('/equipments');
        return;
      }
      form.setFieldsValue({
        title_uz: equipment.title_uz,
        title_ru: equipment.title_ru,
        more_btn_uz: equipment.more_btn_uz,
        more_btn_ru: equipment.more_btn_ru,
        is_visible: equipment.is_visible,
      });
      setInfoUz(equipment.info_uz);
      setInfoRu(equipment.info_ru);
      setDescriptionUz(equipment.description_uz ?? '');
      setDescriptionRu(equipment.description_ru ?? '');
      setSeoUz(equipment.seo_uz ?? '');
      setSeoRu(equipment.seo_ru ?? '');
      setCurrentImg(equipment.img);
      setChars(equipment.main_chars);
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
      const { is_visible, ...rest } = values;

      Object.entries(rest).forEach(([key, val]) => {
        if (val !== undefined && val !== null) formData.append(key, String(val));
      });

      formData.append('is_visible', String(is_visible ?? true));
      if (infoUz) formData.append('info_uz', infoUz);
      if (infoRu) formData.append('info_ru', infoRu);
      if (descriptionUz) formData.append('description_uz', descriptionUz);
      if (descriptionRu) formData.append('description_ru', descriptionRu);
      if (seoUz) formData.append('seo_uz', seoUz);
      if (seoRu) formData.append('seo_ru', seoRu);

      if (fileList[0]?.originFileObj) {
        formData.append('img', fileList[0].originFileObj);
      }

      setLoading(true);
      if (isEdit) {
        await equipmentApi.update(id!, formData);
        message.success('Оборудование обновлено');
      } else {
        await equipmentApi.create(formData);
        message.success('Оборудование создано');
      }
      navigate('/equipments');
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error('Что-то пошло не так');
    } finally {
      setLoading(false);
    }
  };

  // ─── Char modal ───────────────────────────────────────────────────────────

  const openAddChar = () => {
    setEditingChar(null);
    charForm.resetFields();
    setCharModalOpen(true);
  };

  const openEditChar = (char: MainChar) => {
    setEditingChar(char);
    charForm.setFieldsValue({ name_uz: char.name_uz, name_ru: char.name_ru });
    setCharModalOpen(true);
  };

  const handleCharSave = async () => {
    try {
      const values = await charForm.validateFields();
      setCharLoading(true);
      if (editingChar) {
        const updated = await equipmentApi.updateChar(editingChar.id, values);
        setChars((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        message.success('Характеристика обновлена');
      } else {
        const created = await equipmentApi.createChar(id!, values);
        setChars((prev) => [...prev, created]);
        message.success('Характеристика добавлена');
      }
      setCharModalOpen(false);
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error('Что-то пошло не так');
    } finally {
      setCharLoading(false);
    }
  };

  const handleDeleteChar = async () => {
    if (!deletingCharId) return;
    try {
      await equipmentApi.removeChar(deletingCharId);
      setChars((prev) => prev.filter((c) => c.id !== deletingCharId));
      message.success('Характеристика удалена');
    } catch {
      message.error('Не удалось удалить');
    } finally {
      setDeleteCharModalOpen(false);
      setDeletingCharId(null);
    }
  };

  const charColumns: ColumnsType<MainChar> = [
    { title: '№', width: 50, render: (_, __, i) => i + 1 },
    { title: 'Название UZ', dataIndex: 'name_uz' },
    { title: 'Название RU', dataIndex: 'name_ru' },
    {
      title: '',
      width: 90,
      render: (_, record) => (
        <Space size={4}>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEditChar(record)} />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => {
              setDeletingCharId(record.id);
              setDeleteCharModalOpen(true);
            }}
          />
        </Space>
      ),
    },
  ];

  if (fetching) {
    return <Spin style={{ display: 'block', margin: '80px auto' }} />;
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/equipments')} />
        <Title level={4} style={{ margin: 0 }}>
          {isEdit ? 'Редактировать оборудование' : 'Добавить оборудование'}
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{ is_visible: true }}
      >
        <Row gutter={16}>
          {/* Titles */}
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

          {/* More button */}
          <Col span={12}>
            <Form.Item name="more_btn_uz" label="Кнопка «Подробнее» UZ" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="more_btn_ru" label="Кнопка «Подробнее» RU" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>

          {/* Info */}
          <Col span={24}>
            <Form.Item label="Информация UZ" required>
              <RichTextEditor value={infoUz} onChange={setInfoUz} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Информация RU" required>
              <RichTextEditor value={infoRu} onChange={setInfoRu} />
            </Form.Item>
          </Col>

          {/* Description */}
          <Col span={24}>
            <Form.Item label="Описание UZ">
              <RichTextEditor value={descriptionUz} onChange={setDescriptionUz} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Описание RU">
              <RichTextEditor value={descriptionRu} onChange={setDescriptionRu} />
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

          {/* Visibility */}
          <Col span={24}>
            <Form.Item name="is_visible" label="Видимость" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>

          {/* Image */}
          <Col span={24}>
            <Form.Item label={isEdit ? 'Изображение (оставьте пустым чтобы сохранить текущее)' : 'Изображение'}>
              {isEdit && currentImg && fileList.length === 0 && (
                <Image
                  src={`${import.meta.env.VITE_API_URL}/uploads/equipments/${currentImg}`}
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
          <Button onClick={() => navigate('/equipments')}>Отмена</Button>
        </div>
      </Form>

      {/* MainChars — only shown in edit mode */}
      {isEdit && (
        <div style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <Title level={5} style={{ margin: 0 }}>
              Основные характеристики
            </Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={openAddChar}>
              Добавить
            </Button>
          </div>
          <Table
            rowKey="id"
            columns={charColumns}
            dataSource={chars}
            pagination={false}
            size="small"
          />
        </div>
      )}

      {/* Char modal */}
      <Modal
        title={editingChar ? 'Редактировать характеристику' : 'Добавить характеристику'}
        open={charModalOpen}
        onOk={handleCharSave}
        onCancel={() => setCharModalOpen(false)}
        okText={editingChar ? 'Сохранить' : 'Добавить'}
        cancelText="Отмена"
        confirmLoading={charLoading}
      >
        <Form form={charForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name_uz" label="Название UZ" rules={[{ required: true, message: 'Обязательное поле' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name_ru" label="Название RU" rules={[{ required: true, message: 'Обязательное поле' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete char confirm */}
      <Modal
        title="Удалить характеристику?"
        open={deleteCharModalOpen}
        onOk={handleDeleteChar}
        onCancel={() => {
          setDeleteCharModalOpen(false);
          setDeletingCharId(null);
        }}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true }}
      >
        <p>Это действие нельзя отменить.</p>
      </Modal>
    </div>
  );
}
