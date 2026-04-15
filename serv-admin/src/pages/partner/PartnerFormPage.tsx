import { useEffect, useState } from 'react';
import {
  Form, Input, Upload, Button, Row, Col,
  message, Image, Typography, Spin, Switch, Select,
  Table, Modal, Space,
} from 'antd';
import { UploadOutlined, ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';
import { partnerApi } from '../../api/partner';
import type { PartnerCondition } from '../../types/partner';

const { Title } = Typography;

const PARTNER_TYPE_OPTIONS = [
  { value: 'joy', label: 'Joy' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'other', label: 'Other' },
  { value: 'education', label: 'Education' },
  { value: 'style', label: 'Style' },
  { value: 'food', label: 'Food' },
];

export default function PartnerFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [conditionForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // File states
  const [logoFile, setLogoFile] = useState<UploadFile[]>([]);
  const [partnerCardFile, setPartnerCardFile] = useState<UploadFile[]>([]);
  const [imagesFiles, setImagesFiles] = useState<UploadFile[]>([]);

  // Current stored images
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [currentPartnerCard, setCurrentPartnerCard] = useState<string | null>(null);
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  // Conditions
  const [conditions, setConditions] = useState<PartnerCondition[]>([]);
  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState<PartnerCondition | null>(null);
  const [conditionLoading, setConditionLoading] = useState(false);
  const [deletingConditionId, setDeletingConditionId] = useState<string | null>(null);
  const [deleteConditionModalOpen, setDeleteConditionModalOpen] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    partnerApi.getOne(id!).then((partner) => {
      form.setFieldsValue({
        title_uz: partner.title_uz,
        title_ru: partner.title_ru,
        contact_location_ru: partner.contact_location_ru ?? undefined,
        contact_location_uz: partner.contact_location_uz ?? undefined,
        contact_phone: partner.contact_phone ?? undefined,
        contact_site: partner.contact_site ?? undefined,
        facebook: partner.facebook ?? undefined,
        instagram: partner.instagram ?? undefined,
        grafik: partner.grafik ?? undefined,
        order: partner.order,
        info_ru: partner.info_ru ?? undefined,
        info_uz: partner.info_uz ?? undefined,
        cordinates: partner.cordinates ?? undefined,
        promo_count: partner.promo_count ?? undefined,
        promo_info_ru: partner.promo_info_ru ?? undefined,
        promo_info_uz: partner.promo_info_uz ?? undefined,
        telegram: partner.telegram ?? undefined,
        type: partner.type,
        is_visible: partner.is_visible,
      });
      setCurrentLogo(partner.logo);
      setCurrentPartnerCard(partner.partner_card);
      setCurrentImages(partner.images);
      setConditions(partner.conditions);
      setFetching(false);
    }).catch(() => {
      message.error('Партнёр не найден');
      navigate('/partners');
    });
  }, [id]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      const { is_visible, promo_count, ...rest } = values;
      Object.entries(rest).forEach(([key, val]) => {
        if (val !== undefined && val !== null) formData.append(key, String(val));
      });
      formData.append('is_visible', String(is_visible ?? true));
      if (promo_count !== undefined && promo_count !== null && promo_count !== '') {
        formData.append('promo_count', String(promo_count));
      }

      if (logoFile[0]?.originFileObj) formData.append('logo', logoFile[0].originFileObj);
      if (partnerCardFile[0]?.originFileObj) formData.append('partner_card', partnerCardFile[0].originFileObj);
      imagesFiles.forEach((f) => {
        if (f.originFileObj) formData.append('images', f.originFileObj);
      });

      setLoading(true);
      if (isEdit) {
        await partnerApi.update(id!, formData);
        message.success('Партнёр обновлён');
      } else {
        await partnerApi.create(formData);
        message.success('Партнёр создан');
      }
      navigate('/partners');
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error('Что-то пошло не так');
    } finally {
      setLoading(false);
    }
  };

  // ─── Conditions ───────────────────────────────────────────────────────────

  const openAddCondition = () => {
    setEditingCondition(null);
    conditionForm.resetFields();
    setConditionModalOpen(true);
  };

  const openEditCondition = (c: PartnerCondition) => {
    setEditingCondition(c);
    conditionForm.setFieldsValue({ name_ru: c.name_ru, name_uz: c.name_uz ?? undefined });
    setConditionModalOpen(true);
  };

  const handleConditionSave = async () => {
    try {
      const values = await conditionForm.validateFields();
      setConditionLoading(true);
      if (editingCondition) {
        const updated = await partnerApi.updateCondition(editingCondition.id, values);
        setConditions((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        message.success('Условие обновлено');
      } else {
        const created = await partnerApi.createCondition(id!, values);
        setConditions((prev) => [...prev, created]);
        message.success('Условие добавлено');
      }
      setConditionModalOpen(false);
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error('Что-то пошло не так');
    } finally {
      setConditionLoading(false);
    }
  };

  const handleDeleteCondition = async () => {
    if (!deletingConditionId) return;
    try {
      await partnerApi.removeCondition(deletingConditionId);
      setConditions((prev) => prev.filter((c) => c.id !== deletingConditionId));
      message.success('Условие удалено');
    } catch {
      message.error('Не удалось удалить');
    } finally {
      setDeleteConditionModalOpen(false);
      setDeletingConditionId(null);
    }
  };

  const conditionColumns: ColumnsType<PartnerCondition> = [
    { title: '№', width: 50, render: (_, __, i) => i + 1 },
    { title: 'Условие UZ', dataIndex: 'name_uz', render: (v) => v ?? '—' },
    { title: 'Условие RU', dataIndex: 'name_ru' },
    {
      title: '', width: 90,
      render: (_, record) => (
        <Space size={4}>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEditCondition(record)} />
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => { setDeletingConditionId(record.id); setDeleteConditionModalOpen(true); }} />
        </Space>
      ),
    },
  ];

  if (fetching) return <Spin style={{ display: 'block', margin: '80px auto' }} />;

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/partners')} />
        <Title level={4} style={{ margin: 0 }}>
          {isEdit ? 'Редактировать партнёра' : 'Добавить партнёра'}
        </Title>
      </div>

      <Form form={form} layout="vertical" initialValues={{ is_visible: true }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="title_uz" label="Название партнёра UZ" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="title_ru" label="Название партнёра RU" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="contact_location_uz" label="Адрес UZ">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="contact_location_ru" label="Адрес RU">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="contact_phone" label="Телефон">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="contact_site" label="Сайт">
              <Input placeholder="https://" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="facebook" label="Facebook">
              <Input placeholder="https://" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="instagram" label="Instagram">
              <Input placeholder="https://" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="telegram" label="Telegram">
              <Input placeholder="https://" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="order" label="Порядок">
              <Input type="number" min={0} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="grafik" label="График работы">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="cordinates" label="Координаты">
              <Input placeholder="lat,lng" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="info_uz" label="Информация UZ">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="info_ru" label="Информация RU">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="promo_count" label="Кол-во промо">
              <Input type="number" min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="type" label="Тип" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Select options={PARTNER_TYPE_OPTIONS} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="promo_info_uz" label="Промо-информация UZ">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="promo_info_ru" label="Промо-информация RU">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="is_visible" label="Видимость" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>

          {/* Logo */}
          <Col span={24}>
            <Form.Item label={isEdit ? 'Логотип (оставьте пустым чтобы сохранить текущий)' : 'Логотип'}>
              {isEdit && currentLogo && logoFile.length === 0 && (
                <Image
                  src={`${import.meta.env.VITE_API_URL}/uploads/partners/${currentLogo}`}
                  height={80}
                  style={{ objectFit: 'cover', borderRadius: 4, marginBottom: 8, display: 'block' }}
                />
              )}
              <Upload
                beforeUpload={() => false}
                fileList={logoFile}
                onChange={({ fileList: fl }) => setLogoFile(fl.slice(-1))}
                accept="image/*"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Выбрать логотип</Button>
              </Upload>
            </Form.Item>
          </Col>

          {/* Partner card */}
          <Col span={24}>
            <Form.Item label={isEdit ? 'Карточка партнёра (оставьте пустым чтобы сохранить текущую)' : 'Карточка партнёра'}>
              {isEdit && currentPartnerCard && partnerCardFile.length === 0 && (
                <Image
                  src={`${import.meta.env.VITE_API_URL}/uploads/partners/${currentPartnerCard}`}
                  height={80}
                  style={{ objectFit: 'cover', borderRadius: 4, marginBottom: 8, display: 'block' }}
                />
              )}
              <Upload
                beforeUpload={() => false}
                fileList={partnerCardFile}
                onChange={({ fileList: fl }) => setPartnerCardFile(fl.slice(-1))}
                accept="image/*"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Выбрать карточку</Button>
              </Upload>
            </Form.Item>
          </Col>

          {/* Images array */}
          <Col span={24}>
            <Form.Item label="Галерея (новые изображения заменят текущие)">
              {isEdit && currentImages.length > 0 && imagesFiles.length === 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  {currentImages.map((img) => (
                    <Image
                      key={img}
                      src={`${import.meta.env.VITE_API_URL}/uploads/partners/${img}`}
                      width={64}
                      height={64}
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                    />
                  ))}
                </div>
              )}
              <Upload
                beforeUpload={() => false}
                fileList={imagesFiles}
                onChange={({ fileList: fl }) => setImagesFiles(fl)}
                accept="image/*"
                multiple
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Выбрать изображения</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Сохранить' : 'Создать'}
          </Button>
          <Button onClick={() => navigate('/partners')}>Отмена</Button>
        </div>
      </Form>

      {/* Conditions — only in edit mode */}
      {isEdit && (
        <div style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <Title level={5} style={{ margin: 0 }}>Условия</Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={openAddCondition}>Добавить</Button>
          </div>
          <Table rowKey="id" columns={conditionColumns} dataSource={conditions} pagination={false} size="small" />
        </div>
      )}

      {/* Condition modal */}
      <Modal
        title={editingCondition ? 'Редактировать условие' : 'Добавить условие'}
        open={conditionModalOpen}
        onOk={handleConditionSave}
        onCancel={() => setConditionModalOpen(false)}
        okText={editingCondition ? 'Сохранить' : 'Добавить'}
        cancelText="Отмена"
        confirmLoading={conditionLoading}
      >
        <Form form={conditionForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name_uz" label="Условие UZ">
            <Input />
          </Form.Item>
          <Form.Item name="name_ru" label="Условие RU" rules={[{ required: true, message: 'Обязательное поле' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Удалить условие?"
        open={deleteConditionModalOpen}
        onOk={handleDeleteCondition}
        onCancel={() => { setDeleteConditionModalOpen(false); setDeletingConditionId(null); }}
        okText="Удалить" cancelText="Отмена" okButtonProps={{ danger: true }}
      >
        <p>Это действие нельзя отменить.</p>
      </Modal>
    </div>
  );
}
