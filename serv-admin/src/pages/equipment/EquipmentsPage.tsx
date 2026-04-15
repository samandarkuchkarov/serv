import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Typography,
  Modal,
  message,
  Image,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { equipmentApi } from '../../api/equipment';
import type { Equipment } from '../../types/equipment';

const { Title, Text } = Typography;

export default function EquipmentsPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchEquipments = async () => {
    setLoading(true);
    try {
      const data = await equipmentApi.getAll();
      setEquipments(data);
    } catch {
      message.error('Не удалось загрузить оборудование');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleToggleVisibility = async (equipment: Equipment) => {
    try {
      const updated = await equipmentApi.toggleVisibility(equipment.id);
      setEquipments((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    } catch {
      message.error('Не удалось обновить видимость');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await equipmentApi.remove(deletingId);
      setEquipments((prev) => prev.filter((e) => e.id !== deletingId));
      message.success('Оборудование удалено');
    } catch {
      message.error('Не удалось удалить оборудование');
    } finally {
      setDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const columns: ColumnsType<Equipment> = [
    {
      title: '№',
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Фото',
      dataIndex: 'img',
      width: 80,
      render: (img: string) => (
        <Image
          src={`${import.meta.env.VITE_API_URL}/uploads/equipments/${img}`}
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
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.title_ru}
          </Text>
        </div>
      ),
    },
    {
      title: 'Характеристики',
      dataIndex: 'main_chars',
      width: 130,
      render: (chars: Equipment['main_chars']) => (
        <Text>{chars.length} шт.</Text>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'is_visible',
      width: 150,
      render: (is_visible: boolean, record) => (
        <Tag
          color={is_visible ? 'success' : 'error'}
          style={{ cursor: 'pointer' }}
          onClick={() => handleToggleVisibility(record)}
        >
          {is_visible ? 'Опубликовано' : 'Скрыто'}
        </Tag>
      ),
    },
    {
      title: 'Изменить',
      width: 130,
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => navigate(`/equipments/${record.id}/edit`)}
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
          Оборудование
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/equipments/create')}
        >
          Добавить оборудование
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={equipments}
        loading={loading}
        pagination={false}
      />

      <Modal
        title="Удалить оборудование?"
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
