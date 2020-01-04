import React from 'react';
import { Table, Card, Button, Divider, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import FormApp from './Form';
import firebase, { db } from '@/utils/firebase';

const deleteFeatureImage = async filename => {
  const deleted = await firebase
    .storage()
    .ref('property')
    .child(filename)
    .delete();
  return deleted;
};

export default class index extends React.Component {
  state = { visible: false, dataSource: [], updateData: {} };
  columns = [
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'id',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'id',
    },
    {
      title: 'Option',
      dataIndex: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              this.handleUpdateModal(record);
            }}
          >
            Edit
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteData(record)}>Delete</a>
        </>
      ),
    },
  ];
  handleUpdateModal(field) {
    this.setState({ visible: true, updateData: field });
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    db.collection('property')
      .get()
      .then(docs => {
        let arr = [];
        docs.forEach(doc => {
          arr.push({ id: doc.id, ...doc.data() });
        });
        this.setState({ dataSource: arr });
      });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  hideModal() {
    this.setState({ visible: false, updateData: {} });
  }

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleOk = fields => {
    const { updateData } = this.state;
    const hide = message.loading('Progessing');
    if (fields.avatar) {
      const avatarPath = Object.assign(
        {
          name: `${fields.avatar.file.name}`,
          size: `${fields.avatar.file.size}`,
          type: `${fields.avatar.file.type}`,
          path: `property/${fields.avatar.file.name}`,
        },
        {},
      );
      fields.avatar = fields.avatar.file.response;
      fields.avatarPath = avatarPath;
    }

    if (!Object.keys(updateData).length) {
      db.collection('property')
        .add(fields)
        .then(() => {
          hide();
          this.hideModal();
          message.success('Added successfully');
          this.getData();
        })
        .catch(e => {
          hide();
          console.log(e);
          message.error('Failed to add');
        });
    } else {
      db.collection('property')
        .doc(`${updateData.id}`)
        .update(fields)
        .then(() => {
          hide();
          this.hideModal();
          message.success('Updated successfully');
        })
        .catch(err => {
          hide();
          console.log(err);
          message.error('Failed to add');
        });
    }
  };

  async deleteData(field) {
    if (confirm('Are you sure, you want to delete?')) {
      const hide = message.loading('Progessing');
      try {
        const deletePropertyDb = db
          .collection('property')
          .doc(`${field.id}`)
          .delete();
        const deleteIamge = deleteFeatureImage(field.avatarPath.name);
        Promise.all([deletePropertyDb, deleteIamge])
          .then(() => {
            hide();
            message.success('Deleted successfully');
            this.getData();
          })
          .catch(err => {
            hide();
            message.error('Failed to delete');
          });
      } catch (error) {
        hide();
        message.error(error);
      }
    }
  }

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <PageHeaderWrapper content="From admin" title="hello">
        <Card title="Default size card">
          <Button onClick={this.showModal}>Add </Button>
          <FormApp
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            values={this.state.updateData}
          />
          <Table dataSource={this.state.dataSource} columns={this.columns} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
