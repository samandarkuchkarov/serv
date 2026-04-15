import { useEffect, useState } from 'react';
import { Table, Button, Tag, Typography, Modal, message, Image, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { serviceApi } from '../../api/service';
import type { Service } from '../../types/service';

const { Title, Text } = Typography;

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await serviceApi.getAll();
      setServices([...data].sort((a, b) => a.order - b.order));
    } catch {
      message.error('Не удалось загрузить услуги');
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const updated = [...services];
    const aOrder = updated[index].order;
    const bOrder = updated[targetIndex].order;

    const needsInit = updated.some((s, i) => i > 0 && s.order === updated[i - 1].order);
    let reorderItems: { id: string; order: number }[];

    if (needsInit) {
      updated.forEach((s, i) => { updated[i] = { ...s, order: i }; });
      reorderItems = updated.map((s, i) => ({
        id: s.id,
        order: i === index ? targetIndex : i === targetIndex ? index : s.order,
      }));
    } else {
      reorderItems = [
        { id: updated[index].id, order: bOrder },
        { id: updated[targetIndex].id, order: aOrder },
      ];
    }

    const temp = updated[index];
    updated[index] = { ...updated[targetIndex], order: aOrder };
    updated[targetIndex] = { ...temp, order: bOrder };
    setServices(updated);

    try {
      await serviceApi.reorder(reorderItems);
    } catch {
      message.error('Не удалось изменить порядок');
      fetchServices();
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleToggleVisibility = async (service: Service) => {
    try {
      const updated = await serviceApi.toggleVisibility(service.id);
      setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch {
      message.error('Не удалось обновить видимость');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await serviceApi.remove(deletingId);
      setServices((prev) => prev.filter((s) => s.id !== deletingId).sort((a, b) => a.order - b.order));
      message.success('Услуга удалена');
    } catch {
      message.error('Не удалось удалить услугу');
    } finally {
      setDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const columns: ColumnsType<Service> = [
    {
      title: '№',
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Порядок',
      width: 90,
      render: (_, __, index) => (
        <Space size={2}>
          <Button
            icon={<ArrowUpOutlined />}
            size="small"
            disabled={index === 0}
            onClick={() => handleMove(index, 'up')}
          />
          <Button
            icon={<ArrowDownOutlined />}
            size="small"
            disabled={index === services.length - 1}
            onClick={() => handleMove(index, 'down')}
          />
        </Space>
      ),
    },
    {
      title: 'Фото',
      dataIndex: 'image',
      width: 80,
      render: (image: string) => (
        <Image
          src={`${import.meta.env.VITE_API_URL}/uploads/services/${image}`}
          width={48}
          height={48}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Название',
      render: (_, record) => (
        <div>
          <div>{record.title_uz}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.title_ru}</Text>
        </div>
      ),
    },
    {
      title: 'Статус',
      width: 150,
      render: (_, record) => (
        <Tag
          color={record.is_visible ? 'success' : 'error'}
          style={{ cursor: 'pointer' }}
          onClick={() => handleToggleVisibility(record)}
        >
          {record.is_visible ? 'Опубликовано' : 'Скрыто'}
        </Tag>
      ),
    },
    {
      title: 'Изменить',
      width: 130,
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={() => navigate(`/services/${record.id}/edit`)}>
          Изменить
        </Button>
      ),
    },
    {
      title: 'Удалить',
      width: 120,
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => { setDeletingId(record.id); setDeleteModalOpen(true); }}
        >
          Удалить
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Услуги</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/services/create')}>
          Добавить услугу
        </Button>
      </div>

      <Table rowKey="id" columns={columns} dataSource={services} loading={loading} pagination={false} />

      <Modal
        title="Удалить услугу?"
        open={deleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => { setDeleteModalOpen(false); setDeletingId(null); }}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true }}
      >
        <p>Это действие нельзя отменить.</p>
      </Modal>
    </div>
  );
}
