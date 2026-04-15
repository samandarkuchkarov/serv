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
import { advantagesApi } from '../../api/advantages';
import type { Advantage } from '../../types/advantage';

interface Props {
  open: boolean;
  advantage: Advantage | null;
  onClose: () => void;
  onSaved: (advantage: Advantage, isNew: boolean) => void;
}

export default function AdvantageModal({ open, advantage, onClose, onSaved }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const isEdit = !!advantage;

  useEffect(() => {
    if (open) {
      if (advantage) {
        form.setFieldsValue(advantage);
      } else {
        form.resetFields();
      }
      setFileList([]);
    }
  }, [open, advantage, form]);

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
        ? await advantagesApi.update(advantage.id, formData)
        : await advantagesApi.create(formData);

      message.success(isEdit ? 'Преимущество обновлено' : 'Преимущество создано');
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
      title={isEdit ? 'Редактировать преимущество' : 'Добавить преимущество'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={isEdit ? 'Сохранить' : 'Создать'}
      cancelText="Отмена"
      confirmLoading={loading}
      width={620}
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
          <Col span={24}>
            <Form.Item label={isEdit ? 'Изображение (оставьте пустым чтобы сохранить текущее)' : 'Изображение'}>
              {isEdit && advantage?.image && fileList.length === 0 && (
                <Image
                  src={`${import.meta.env.VITE_API_URL}/uploads/advantages/${advantage.image}`}
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
