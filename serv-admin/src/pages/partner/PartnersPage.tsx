import { useEffect, useState } from 'react';
import { Table, Button, Tag, Typography, Modal, message, Image, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { partnerApi } from '../../api/partner';
import type { Partner } from '../../types/partner';

const { Title, Text } = Typography;

const TYPE_LABELS: Record<string, string> = {
  joy: 'Joy',
  beauty: 'Beauty',
  other: 'Other',
  education: 'Education',
  style: 'Style',
  food: 'Food',
};

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const data = await partnerApi.getAll();
      setPartners([...data].sort((a, b) => a.order - b.order));
    } catch {
      message.error('Не удалось загрузить партнёров');
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= partners.length) return;

    const updated = [...partners];
    const aOrder = updated[index].order;
    const bOrder = updated[targetIndex].order;

    // If orders are equal, assign unique sequential orders first
    const needsInit = updated.some((p, i) => i > 0 && p.order === updated[i - 1].order);
    let reorderItems: { id: string; order: number }[];

    if (needsInit) {
      updated.forEach((p, i) => { p = { ...p, order: i }; updated[i] = p; });
      updated[index] = { ...updated[index], order: targetIndex };
      updated[targetIndex] = { ...updated[targetIndex], order: index };
      reorderItems = updated.map((p, i) => ({ id: p.id, order: i === index ? targetIndex : i === targetIndex ? index : p.order }));
    } else {
      reorderItems = [
        { id: updated[index].id, order: bOrder },
        { id: updated[targetIndex].id, order: aOrder },
      ];
    }

    // Swap in local state
    const temp = updated[index];
    updated[index] = { ...updated[targetIndex], order: aOrder };
    updated[targetIndex] = { ...temp, order: bOrder };
    setPartners(updated);

    try {
      await partnerApi.reorder(reorderItems);
    } catch {
      message.error('Не удалось изменить порядок');
      fetchPartners();
    }
  };

  useEffect(() => { fetchPartners(); }, []);

  const handleToggleVisibility = async (partner: Partner) => {
    try {
      const updated = await partnerApi.toggleVisibility(partner.id);
      setPartners((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch {
      message.error('Не удалось обновить видимость');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await partnerApi.remove(deletingId);
      setPartners((prev) => prev.filter((p) => p.id !== deletingId).sort((a, b) => a.order - b.order));
      message.success('Партнёр удалён');
    } catch {
      message.error('Не удалось удалить партнёра');
    } finally {
      setDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const columns: ColumnsType<Partner> = [
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
            disabled={index === partners.length - 1}
            onClick={() => handleMove(index, 'down')}
          />
        </Space>
      ),
    },
    {
      title: 'Логотип',
      dataIndex: 'logo',
      width: 80,
      render: (logo: string | null) =>
        logo ? (
          <Image
            src={`${import.meta.env.VITE_API_URL}/uploads/partners/${logo}`}
            width={48}
            height={48}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
        ) : (
          <div style={{ width: 48, height: 48, background: '#f0f0f0', borderRadius: 4 }} />
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
      title: 'Тип',
      dataIndex: 'type',
      width: 110,
      render: (type: string) => <Tag>{TYPE_LABELS[type] ?? type}</Tag>,
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
        <Button icon={<EditOutlined />} onClick={() => navigate(`/partners/${record.id}/edit`)}>
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
        <Title level={4} style={{ margin: 0 }}>Партнёры</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/partners/create')}>
          Добавить партнёра
        </Button>
      </div>

      <Table rowKey="id" columns={columns} dataSource={partners} loading={loading} pagination={false} />

      <Modal
        title="Удалить партнёра?"
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
