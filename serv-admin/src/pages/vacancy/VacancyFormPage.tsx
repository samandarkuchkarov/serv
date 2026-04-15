import { useEffect, useState } from 'react';
import {
  Form, Input, Button, Row, Col, message, Typography, Spin, Switch,
  Table, Modal, Space,
} from 'antd';
import {
  ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';
import { vacancyApi } from '../../api/vacancy';
import type { VacancyCondition, VacancyRequirement } from '../../types/vacancy';
import RichTextEditor from '../../components/RichTextEditor';

const { Title } = Typography;

export default function VacancyFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [conditionForm] = Form.useForm();
  const [requirementForm] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Rich text fields
  const [contactNameUz, setContactNameUz] = useState('');
  const [contactNameRu, setContactNameRu] = useState('');
  const [garantUz, setGarantUz] = useState('');
  const [garantRu, setGarantRu] = useState('');
  const [resUz, setResUz] = useState('');
  const [resRu, setResRu] = useState('');

  // Nested lists
  const [conditions, setConditions] = useState<VacancyCondition[]>([]);
  const [requirements, setRequirements] = useState<VacancyRequirement[]>([]);

  // Condition modal
  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState<VacancyCondition | null>(null);
  const [conditionLoading, setConditionLoading] = useState(false);
  const [deletingConditionId, setDeletingConditionId] = useState<string | null>(null);
  const [deleteConditionModalOpen, setDeleteConditionModalOpen] = useState(false);

  // Requirement modal
  const [requirementModalOpen, setRequirementModalOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<VacancyRequirement | null>(null);
  const [requirementLoading, setRequirementLoading] = useState(false);
  const [deletingRequirementId, setDeletingRequirementId] = useState<string | null>(null);
  const [deleteRequirementModalOpen, setDeleteRequirementModalOpen] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    vacancyApi.getAll().then((list) => {
      const vacancy = list.find((v) => v.id === id);
      if (!vacancy) {
        message.error('Вакансия не найдена');
        navigate('/vacancies');
        return;
      }
      form.setFieldsValue({
        title_uz: vacancy.title_uz,
        title_ru: vacancy.title_ru,
        city: vacancy.city,
        contact_phone: vacancy.contact_phone,
        subtitle_ru: vacancy.subtitle_ru ?? undefined,
        subtitle_uz: vacancy.subtitle_uz ?? undefined,
        is_visible: vacancy.is_visible,
      });
      setContactNameUz(vacancy.contact_name_uz ?? '');
      setContactNameRu(vacancy.contact_name_ru ?? '');
      setGarantUz(vacancy.garant_uz ?? '');
      setGarantRu(vacancy.garant_ru ?? '');
      setResUz(vacancy.res_uz ?? '');
      setResRu(vacancy.res_ru ?? '');
      setConditions(vacancy.conditions);
      setRequirements(vacancy.requirements);
      setFetching(false);
    });
  }, [id]);

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        contact_name_uz: contactNameUz,
        contact_name_ru: contactNameRu,
        garant_uz: garantUz,
        garant_ru: garantRu,
        res_uz: resUz,
        res_ru: resRu,
      };
      setLoading(true);
      if (isEdit) {
        await vacancyApi.update(id!, payload);
        message.success('Вакансия обновлена');
      } else {
        await vacancyApi.create(payload);
        message.success('Вакансия создана');
      }
      navigate('/vacancies');
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

  const openEditCondition = (c: VacancyCondition) => {
    setEditingCondition(c);
    conditionForm.setFieldsValue({ condition_name_ru: c.condition_name_ru, condition_name_uz: c.condition_name_uz ?? undefined });
    setConditionModalOpen(true);
  };

  const handleConditionSave = async () => {
    try {
      const values = await conditionForm.validateFields();
      setConditionLoading(true);
      if (editingCondition) {
        const updated = await vacancyApi.updateCondition(editingCondition.id, values);
        setConditions((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        message.success('Условие обновлено');
      } else {
        const created = await vacancyApi.createCondition(id!, values);
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
      await vacancyApi.removeCondition(deletingConditionId);
      setConditions((prev) => prev.filter((c) => c.id !== deletingConditionId));
      message.success('Условие удалено');
    } catch {
      message.error('Не удалось удалить');
    } finally {
      setDeleteConditionModalOpen(false);
      setDeletingConditionId(null);
    }
  };

  // ─── Requirements ─────────────────────────────────────────────────────────

  const openAddRequirement = () => {
    setEditingRequirement(null);
    requirementForm.resetFields();
    setRequirementModalOpen(true);
  };

  const openEditRequirement = (r: VacancyRequirement) => {
    setEditingRequirement(r);
    requirementForm.setFieldsValue({ name_ru: r.name_ru, name_uz: r.name_uz ?? undefined });
    setRequirementModalOpen(true);
  };

  const handleRequirementSave = async () => {
    try {
      const values = await requirementForm.validateFields();
      setRequirementLoading(true);
      if (editingRequirement) {
        const updated = await vacancyApi.updateRequirement(editingRequirement.id, values);
        setRequirements((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        message.success('Требование обновлено');
      } else {
        const created = await vacancyApi.createRequirement(id!, values);
        setRequirements((prev) => [...prev, created]);
        message.success('Требование добавлено');
      }
      setRequirementModalOpen(false);
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error('Что-то пошло не так');
    } finally {
      setRequirementLoading(false);
    }
  };

  const handleDeleteRequirement = async () => {
    if (!deletingRequirementId) return;
    try {
      await vacancyApi.removeRequirement(deletingRequirementId);
      setRequirements((prev) => prev.filter((r) => r.id !== deletingRequirementId));
      message.success('Требование удалено');
    } catch {
      message.error('Не удалось удалить');
    } finally {
      setDeleteRequirementModalOpen(false);
      setDeletingRequirementId(null);
    }
  };

  // ─── Table columns ────────────────────────────────────────────────────────

  const conditionColumns: ColumnsType<VacancyCondition> = [
    { title: '№', width: 50, render: (_, __, i) => i + 1 },
    { title: 'Условие UZ', dataIndex: 'condition_name_uz', render: (v) => v ?? '—' },
    { title: 'Условие RU', dataIndex: 'condition_name_ru' },
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

  const requirementColumns: ColumnsType<VacancyRequirement> = [
    { title: '№', width: 50, render: (_, __, i) => i + 1 },
    { title: 'Требование UZ', dataIndex: 'name_uz', render: (v) => v ?? '—' },
    { title: 'Требование RU', dataIndex: 'name_ru' },
    {
      title: '', width: 90,
      render: (_, record) => (
        <Space size={4}>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEditRequirement(record)} />
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => { setDeletingRequirementId(record.id); setDeleteRequirementModalOpen(true); }} />
        </Space>
      ),
    },
  ];

  if (fetching) return <Spin style={{ display: 'block', margin: '80px auto' }} />;

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/vacancies')} />
        <Title level={4} style={{ margin: 0 }}>
          {isEdit ? 'Редактировать вакансию' : 'Добавить вакансию'}
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
            <Form.Item name="city" label="Город" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="contact_phone" label="Контактный телефон" rules={[{ required: true, message: 'Обязательное поле' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Контактное имя UZ">
              <RichTextEditor value={contactNameUz} onChange={setContactNameUz} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Контактное имя RU">
              <RichTextEditor value={contactNameRu} onChange={setContactNameRu} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="subtitle_uz" label="Подзаголовок UZ">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="subtitle_ru" label="Подзаголовок RU">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Гарантии UZ">
              <RichTextEditor value={garantUz} onChange={setGarantUz} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Гарантии RU">
              <RichTextEditor value={garantRu} onChange={setGarantRu} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Результат UZ">
              <RichTextEditor value={resUz} onChange={setResUz} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Результат RU">
              <RichTextEditor value={resRu} onChange={setResRu} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="is_visible" label="Видимость" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Сохранить' : 'Создать'}
          </Button>
          <Button onClick={() => navigate('/vacancies')}>Отмена</Button>
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

      {/* Requirements — only in edit mode */}
      {isEdit && (
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <Title level={5} style={{ margin: 0 }}>Требования</Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={openAddRequirement}>Добавить</Button>
          </div>
          <Table rowKey="id" columns={requirementColumns} dataSource={requirements} pagination={false} size="small" />
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
          <Form.Item name="condition_name_uz" label="Условие UZ">
            <Input />
          </Form.Item>
          <Form.Item name="condition_name_ru" label="Условие RU" rules={[{ required: true, message: 'Обязательное поле' }]}>
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

      {/* Requirement modal */}
      <Modal
        title={editingRequirement ? 'Редактировать требование' : 'Добавить требование'}
        open={requirementModalOpen}
        onOk={handleRequirementSave}
        onCancel={() => setRequirementModalOpen(false)}
        okText={editingRequirement ? 'Сохранить' : 'Добавить'}
        cancelText="Отмена"
        confirmLoading={requirementLoading}
      >
        <Form form={requirementForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name_uz" label="Требование UZ">
            <Input />
          </Form.Item>
          <Form.Item name="name_ru" label="Требование RU" rules={[{ required: true, message: 'Обязательное поле' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Удалить требование?"
        open={deleteRequirementModalOpen}
        onOk={handleDeleteRequirement}
        onCancel={() => { setDeleteRequirementModalOpen(false); setDeletingRequirementId(null); }}
        okText="Удалить" cancelText="Отмена" okButtonProps={{ danger: true }}
      >
        <p>Это действие нельзя отменить.</p>
      </Modal>
    </div>
  );
}
