import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Divider, Button, Dropdown, Menu, Icon, message, Avatar, Badge } from 'antd';
import ProTable from '@ant-design/pro-table';
import SearchForm from './components/SearchForm';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryUser, addUser, updateUser } from './service';

const handleAdd = async fields => {
  const hide = message.loading('Adding');
  try {
    await addUser(fields);

    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error(error.message);
    return false;
  }
};

const handleRemove = async selectedRows => {
  const hide = message.loading('deleting');
  if (!selectedRows) return true;
  try {
    // await removeRule({
    //   key: selectedRows.map(row => row.key),
    // });
    hide();
    message.success('Deleted successfully, refreshing soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const ListUser = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [updateValue, setUpdateValue] = useState({});
  const actionRef = useRef();
  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      render: avatar => <Avatar src={avatar} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      render: (_, record) => (
        <a href={`tel:${record.phonePrefix}${record.phone}`}>
          ({record.phonePrefix}) {record.phone}
        </a>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(status) {
        if (status) {
          return <Badge count="Active" style={{ backgroundColor: '#52c41a', fontSize: '14px' }} />;
        }
        return <Badge count="Inactive" style={{ backgroundColor: 'red', fontSize: '14px' }} />;
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      valueType: 'action',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setUpdateValue(record);
            }}
          >
            Edit
          </a>
          <Divider type="vertical" />
          <a href="#">Deactivate</a>
        </>
      ),
    },
  ];

  const handleUpdate = async fields => {
    const hide = message.loading('Updating');
    if (!updateValue.id) return message.error('Invalid user id!');
    try {
      await updateUser(fields, updateValue.id);
      hide();

      message.success('Update succeeded');
      setUpdateValue({});
      return true;
    } catch (error) {
      hide();
      message.error(error.message);
      return false;
    }
  };

  return (
    <PageHeaderWrapper>
      <SearchForm />
      <ProTable
        headerTitle="List User"
        // options={{ setting: false }}
        search={false}
        rowKey="id"
        actionRef={actionRef}
        toolBarRender={(action, { selectedRows }) => [
          <Button icon="plus" type="primary" onClick={() => handleModalVisible(true)}>
            New
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async e => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRows);
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">batch deletion</Menu.Item>
                  <Menu.Item key="approval">Batch approval</Menu.Item>
                </Menu>
              }
            >
              <Button>
                Batch operation <Icon type="down" />
              </Button>
            </Dropdown>
          ),
        ]}
        request={params => queryUser(params)}
        columns={columns}
        // rowSelection={{}}
      />
      <CreateForm
        onSubmit={async (value, callback) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
            if (callback) callback(success);
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
      <UpdateForm
        onSubmit={async value => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
        }}
        modalVisible={updateModalVisible}
        values={updateValue}
      />
    </PageHeaderWrapper>
  );
};

export default ListUser;
