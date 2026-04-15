import { useEffect, useState } from 'react';
import { Button, Typography, Tag, Modal, message, Empty, Table } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { constructorApi } from '../../api/constructor';
import type { Section } from '../../types/constructor';
import SectionModal from './SectionModal';

const { Title, Text } = Typography;

export default function ConstructorPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);

  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(
    null,
  );
  const [deleteSectionModalOpen, setDeleteSectionModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchSections = async () => {
    setLoading(true);
    try {
      const data = await constructorApi.getAll();
      setSections(data);
    } catch {
      message.error('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSectionSaved = (saved: Section, isNew: boolean) => {
    if (isNew) {
      setSections((prev) => [...prev, { ...saved, items: [] }]);
    } else {
      setSections((prev) =>
        prev.map((s) => (s.id === saved.id ? { ...s, name: saved.name } : s)),
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSectionId) return;
    try {
      await constructorApi.deleteSection(deletingSectionId);
      setSections((prev) => prev.filter((s) => s.id !== deletingSectionId));
      message.success('Категория удалена');
    } catch {
      message.error('Не удалось удалить категорию');
    } finally {
      setDeleteSectionModalOpen(false);
      setDeletingSectionId(null);
    }
  };

  const columns: ColumnsType<Section> = [
    {
      title: 'Название',
      dataIndex: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Элементов',
      dataIndex: 'items',
      width: 120,
      render: (items: Section['items']) => (
        <Tag color="blue">{items.length}</Tag>
      ),
    },
    {
      title: 'Действия',
      width: 130,
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            setEditingSection(record);
            setSectionModalOpen(true);
          }}
        >
          Изменить
        </Button>
      ),
    },
    {
      title: 'Действия',
      width: 120,
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={(e) => {
            e.stopPropagation();
            setDeletingSectionId(record.id);
            setDeleteSectionModalOpen(true);
          }}
        >
          Удалить
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Конструктор
        </Title>
        <Button
          type="primary"
          icon={<AppstoreAddOutlined />}
          onClick={() => {
            setEditingSection(null);
            setSectionModalOpen(true);
          }}
        >
          Добавить категорию
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={sections}
        loading={loading}
        pagination={false}
        locale={{ emptyText: <Empty description="Нет категорий" /> }}
        onRow={(record) => ({
          onClick: () => navigate(`/constructor/sections/${record.id}`),
          style: { cursor: 'pointer' },
        })}
      />

      <SectionModal
        open={sectionModalOpen}
        section={editingSection}
        onClose={() => {
          setSectionModalOpen(false);
          setEditingSection(null);
        }}
        onSaved={handleSectionSaved}
      />

      <Modal
        title="Удалить категорию?"
        open={deleteSectionModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteSectionModalOpen(false);
          setDeletingSectionId(null);
        }}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true }}
      >
        <p>
          Все элементы категории также будут удалены. Это действие нельзя
          отменить.
        </p>
      </Modal>
    </div>
  );
}
