import React from 'react';
import { Form, Select, Input, Modal, Upload, Icon, message } from 'antd';
import firebase from '@/utils/firebase';

const { Option } = Select;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const uploadFeatureImage = file =>
  new Promise((resolve, reject) => {
    const uploadTask = firebase
      .storage()
      .ref('property')
      .child(file.name)
      .put(file);
    uploadTask.on(
      'state_changed',
      snapshot => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      error => {
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          resolve(downloadURL);
        });
      },
    );
  });

class AppForm extends React.Component {
  state = {
    loading: false,
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        // console.log(this.props.onOk);
        // console.log(values);
        this.props.onOk(values);
      }
    });
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, () =>
        this.setState({
          loading: false,
        }),
      );
    }
  };

  customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const url = await uploadFeatureImage(file);
      onSuccess(url);
      this.setState({ imageUrl: url });
      console.log(url);
    } catch (error) {
      onError(error);
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { values } = this.props;
    const isUpdateData = Object.keys(values).length;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;

    return (
      <Modal
        title="Basic Modal"
        visible={this.props.visible}
        onOk={this.handleSubmit}
        onCancel={this.props.onCancel}
      >
        <Form.Item label="Avatar">
          {getFieldDecorator('avatar', {
            initialValue: isUpdateData ? values.note : '',
            rules: [{ required: true, message: 'Please input your note!' }],
          })(
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={this.handleChange}
              customRequest={this.customRequest}
            >
              {isUpdateData && values.avatar ? (
                <img src={values.avatar} alt="avatar" style={{ width: '100%' }} />
              ) : imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>,
          )}
        </Form.Item>
        <Form.Item label="Note">
          {getFieldDecorator('note', {
            initialValue: isUpdateData ? values.note : '',
            rules: [{ required: true, message: 'Please input your note!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Gender">
          {getFieldDecorator('gender', {
            initialValue: isUpdateData ? values.gender : '',
            rules: [{ required: true, message: 'Please select your gender!' }],
          })(
            <Select
              placeholder="Select a option and change input text above"
              onChange={this.handleSelectChange}
            >
              <Option value="male">male</Option>
              <Option value="female">female</Option>
            </Select>,
          )}
        </Form.Item>
      </Modal>
    );
  }
}

export default Form.create({ name: 'coordinated' })(AppForm);
