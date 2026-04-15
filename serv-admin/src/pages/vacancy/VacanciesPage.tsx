import { useEffect, useState } from 'react';
import { Table, Button, Tag, Typography, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { vacancyApi } from '../../api/vacancy';
import type { Vacancy } from '../../types/vacancy';

const { Title, Text } = Typography;

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchVacancies = async () => {
    setLoading(true);
    try {
      setVacancies(await vacancyApi.getAll());
    } catch {
      message.error('Не удалось загрузить вакансии');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVacancies(); }, []);

  const handleToggleVisibility = async (vacancy: Vacancy) => {
    try {
      const updated = await vacancyApi.toggleVisibility(vacancy.id);
      setVacancies((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    } catch {
      message.error('Не удалось обновить видимость');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await vacancyApi.remove(deletingId);
      setVacancies((prev) => prev.filter((v) => v.id !== deletingId));
      message.success('Вакансия удалена');
    } catch {
      message.error('Не удалось удалить вакансию');
    } finally {
      setDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const columns: ColumnsType<Vacancy> = [
    {
      title: '№',
      width: 50,
      render: (_, __, index) => index + 1,
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
      title: 'Город',
      dataIndex: 'city',
      width: 130,
    },
    {
      title: 'Телефон',
      dataIndex: 'contact_phone',
      width: 150,
    },
    {
      title: 'Условия',
      width: 90,
      render: (_, record) => <Text>{record.conditions.length} шт.</Text>,
    },
    {
      title: 'Требования',
      width: 110,
      render: (_, record) => <Text>{record.requirements.length} шт.</Text>,
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
        <Button
          icon={<EditOutlined />}
          onClick={() => navigate(`/vacancies/${record.id}/edit`)}
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
        <Title level={4} style={{ margin: 0 }}>Вакансии</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/vacancies/create')}>
          Добавить вакансию
        </Button>
      </div>

      <Table rowKey="id" columns={columns} dataSource={vacancies} loading={loading} pagination={false} />

      <Modal
        title="Удалить вакансию?"
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
