import { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Table,
  Tag,
  Space,
  Tooltip,
  Modal,
  message,
  Empty,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { constructorApi } from '../../api/constructor';
import type { Section, ConstructorItem } from '../../types/constructor';

const { Title, Text } = Typography;

const PAGE_LABELS: Record<string, string> = {
  internet: 'Интернет',
  fiz: 'Физ. лицо',
  teh: 'Техподдержка',
  yur: 'Юр. лицо',
  data: 'Data',
  iptv: 'IPTV',
  equipments: 'Оборудование',
  other: 'Другое',
  both: 'Оба',
};

export default function SectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();

  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);

  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    constructorApi.getAll().then((sections) => {
      const found = sections.find((s) => s.id === sectionId);
      if (!found) {
        message.error('Секция не найдена');
        navigate('/constructor');
        return;
      }
      setSection(found);
      setLoading(false);
    });
  }, [sectionId]);

  const handleToggleVisibility = async (item: ConstructorItem) => {
    try {
      const updated = await constructorApi.toggleVisibility(item.id);
      setSection((prev) =>
        prev ? { ...prev, items: prev.items.map((i) => (i.id === updated.id ? updated : i)) } : prev,
      );
    } catch {
      message.error('Не удалось обновить видимость');
    }
  };

  const handleToggleArchive = async (item: ConstructorItem) => {
    try {
      const updated = await constructorApi.toggleArchive(item.id);
      setSection((prev) =>
        prev ? { ...prev, items: prev.items.map((i) => (i.id === updated.id ? updated : i)) } : prev,
      );
    } catch {
      message.error('Не удалось обновить архивный статус');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItemId) return;
    try {
      await constructorApi.deleteItem(deletingItemId);
      setSection((prev) =>
        prev ? { ...prev, items: prev.items.filter((i) => i.id !== deletingItemId) } : prev,
      );
      message.success('Элемент удалён');
    } catch {
      message.error('Не удалось удалить элемент');
    } finally {
      setDeleteModalOpen(false);
      setDeletingItemId(null);
    }
  };

  const columns: ColumnsType<ConstructorItem> = [
    {
      title: '№',
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Заголовок',
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
      title: 'Страница',
      dataIndex: 'page',
      width: 120,
      render: (page: string | null) =>
        page ? (
          <Tag color="blue">{PAGE_LABELS[page] ?? page}</Tag>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: 'Города',
      dataIndex: 'cities',
      width: 110,
      render: (cities: string[]) =>
        cities.length > 0 ? <Text>{cities.join(', ')}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Видимость',
      dataIndex: 'is_visible',
      width: 130,
      render: (is_visible: boolean, record) => (
        <Tag
          color={is_visible ? 'success' : 'error'}
          style={{ cursor: 'pointer' }}
          onClick={() => handleToggleVisibility(record)}
        >
          {is_visible ? 'Виден' : 'Скрыт'}
        </Tag>
      ),
    },
    {
      title: 'Архив',
      dataIndex: 'is_archived',
      width: 120,
      render: (is_archived: boolean, record) => (
        <Tag
          color={is_archived ? 'warning' : 'default'}
          style={{ cursor: 'pointer' }}
          onClick={() => handleToggleArchive(record)}
        >
          {is_archived ? 'В архиве' : 'Активен'}
        </Tag>
      ),
    },
    {
      title: '',
      width: 90,
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Редактировать">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => navigate(`/constructor/items/${record.id}/edit`)}
            />
          </Tooltip>
          <Tooltip title="Удалить">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => {
                setDeletingItemId(record.id);
                setDeleteModalOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <Spin style={{ display: 'block', margin: '80px auto' }} />;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/constructor')} />
          <Title level={4} style={{ margin: 0 }}>
            {section?.name}
          </Title>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(`/constructor/sections/${sectionId}/items/create`)}
        >
          Добавить элемент
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={section?.items ?? []}
        pagination={false}
        locale={{ emptyText: <Empty description="Нет элементов" /> }}
      />

      <Modal
        title="Удалить элемент?"
        open={deleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setDeletingItemId(null);
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
