import React, { useRef, useState } from 'react';
import { Divider, Button, Dropdown, Menu, Icon, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import SearchForm from './components/SearchForm';
import { queryRule, updateRule, addRule, removeRule } from './service';

const handleAdd = async fields => {
  const hide = message.loading('Adding');
  try {
    await addRule({
      desc: fields.desc,
    });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Add failed, please try again!');
    return false;
  }
};

const handleRemove = async selectedRows => {
  const hide = message.loading('deleting');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map(row => row.key),
    });
    hide();
    message.success('Deleted successfully, refreshing soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const handleUpdate = async fields => {
  const hide = message.loading('Configuring');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('Configuration succeeded');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed Please try again!');
    return false;
  }
};

const Admin = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'desc',
    },
    {
      title: 'Number of service calls',
      dataIndex: 'callNo',
      sorter: true,
      renderText: val => `${val} Ten thousand`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: {
        0: { text: 'shut down', status: 'Default' },
        1: { text: 'In operation', status: 'Processing' },
        2: { text: 'Online', status: 'Success' },
        3: { text: 'abnormal', status: 'Error' },
      },
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: 'Option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            Configuration
          </a>
          <Divider type="vertical" />
          <a href="">Subscribe to alerts</a>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper content="From admin">
      <SearchForm />
      <ProTable
        headerTitle="User List"
        actionRef={actionRef}
        rowKey="key"
        search={false}
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
        tableAlertRender={(selectedRowKeys, selectedRows) => (
          <div>
            chosen <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> item&nbsp;&nbsp;
            <span>
              Total number of service calls{' '}
              {selectedRows.reduce((pre, item) => pre + item.callNo, 0)} Ten thousand
            </span>
          </div>
        )}
        request={params => queryRule(params)}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm
        onSubmit={async value => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);
            if (success) {
              handleModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default Admin;
