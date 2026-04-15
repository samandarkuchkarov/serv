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
import { bannersApi } from '../../api/banners';
import type { Banner } from '../../types/banner';

const { Title, Text } = Typography;

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await bannersApi.getAll();
      setBanners(data);
    } catch {
      message.error('Не удалось загрузить баннеры');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleToggleVisibility = async (banner: Banner) => {
    try {
      const updated = await bannersApi.toggleVisibility(banner.id);
      setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    } catch {
      message.error('Не удалось обновить видимость');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await bannersApi.remove(deletingId);
      setBanners((prev) => prev.filter((b) => b.id !== deletingId));
      message.success('Баннер удалён');
    } catch {
      message.error('Не удалось удалить баннер');
    } finally {
      setDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newBanners = [...banners];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newBanners[index], newBanners[swapIndex]] = [newBanners[swapIndex], newBanners[index]];
    setBanners(newBanners);
    try {
      await bannersApi.reorder(newBanners.map((b) => b.id));
    } catch {
      message.error('Не удалось изменить порядок');
      fetchBanners();
    }
  };

  const columns: ColumnsType<Banner> = [
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
              disabled={index === banners.length - 1}
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
          onClick={() => navigate(`/banners/${record.id}/edit`)}
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
          Баннеры
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/banners/create')}
        >
          Добавить баннер
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={banners}
        loading={loading}
        pagination={false}
      />

      <Modal
        title="Удалить баннер?"
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
