import { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useState } from 'react';
import { constructorApi } from '../../api/constructor';
import type { Section } from '../../types/constructor';

interface Props {
  open: boolean;
  section: Section | null;
  onClose: () => void;
  onSaved: (section: Section, isNew: boolean) => void;
}

export default function SectionModal({ open, section, onClose, onSaved }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!section;

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ name: section?.name ?? '' });
    } else {
      form.resetFields();
    }
  }, [open, section]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (isEdit) {
        const updated = await constructorApi.updateSection(section.id, values);
        message.success('Категория обновлена');
        onSaved(updated, false);
      } else {
        const created = await constructorApi.createSection(values);
        message.success('Категория создана');
        onSaved(created, true);
      }
      onClose();
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error('Что-то пошло не так');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Переименовать категорию' : 'Добавить категорию'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText={isEdit ? 'Сохранить' : 'Создать'}
      cancelText="Отмена"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="name"
          label="Название категории"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input placeholder="Например: Главная страница" autoFocus />
        </Form.Item>
      </Form>
    </Modal>
  );
}
