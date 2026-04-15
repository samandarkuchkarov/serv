import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Tooltip,
  Modal,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { advantagesApi } from '../../api/advantages';
import type { Advantage } from '../../types/advantage';

const { Title, Text } = Typography;

export default function AdvantagesPage() {
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchAdvantages = async () => {
    setLoading(true);
    try {
      const data = await advantagesApi.getAll();
      setAdvantages(data);
    } catch {
      message.error('Не удалось загрузить преимущества');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvantages();
  }, []);

  const handleToggleVisibility = async (advantage: Advantage) => {
    try {
      const updated = await advantagesApi.toggleVisibility(advantage.id);
      setAdvantages((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    } catch {
      message.error('Не удалось обновить видимость');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await advantagesApi.remove(deletingId);
      setAdvantages((prev) => prev.filter((a) => a.id !== deletingId));
      message.success('Преимущество удалено');
    } catch {
      message.error('Не удалось удалить преимущество');
    } finally {
      setDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newAdvantages = [...advantages];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newAdvantages[index], newAdvantages[swapIndex]] = [newAdvantages[swapIndex], newAdvantages[index]];
    setAdvantages(newAdvantages);
    try {
      await advantagesApi.reorder(newAdvantages.map((a) => a.id));
    } catch {
      message.error('Не удалось изменить порядок');
      fetchAdvantages();
    }
  };

  const columns: ColumnsType<Advantage> = [
    {
      title: '№',
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Заголовок',
      dataIndex: 'title_uz',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {id}
        </Text>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'isVisible',
      width: 140,
      render: (isVisible: boolean, record) => (
        <Tag
          color={isVisible ? 'success' : 'error'}
          style={{ cursor: 'pointer' }}
          onClick={() => handleToggleVisibility(record)}
        >
          {isVisible ? 'Опубликован' : 'Не опубликован'}
        </Tag>
      ),
    },
    {
      title: 'Порядок',
      width: 90,
      render: (_, __, index) => (
        <Space size={4}>
          <Tooltip title="Вверх">
            <Button
              icon={<ArrowUpOutlined />}
              size="small"
              disabled={index === 0}
              onClick={() => handleMove(index, 'up')}
            />
          </Tooltip>
          <Tooltip title="Вниз">
            <Button
              icon={<ArrowDownOutlined />}
              size="small"
              disabled={index === advantages.length - 1}
              onClick={() => handleMove(index, 'down')}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: 'Изменить',
      width: 120,
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => navigate(`/advantages/${record.id}/edit`)}
        >
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
          onClick={() => {
            setDeletingId(record.id);
            setDeleteModalOpen(true);
          }}
        >
          Удалить
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Почему выбирают Comnet
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/advantages/create')}
        >
          Добавить
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={advantages}
        loading={loading}
        pagination={false}
      />

      <Modal
        title="Удалить преимущество?"
        open={deleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setDeletingId(null);
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
