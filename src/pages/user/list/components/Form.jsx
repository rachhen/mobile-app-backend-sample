/* eslint-disable react/jsx-boolean-value */
import React, { useState } from 'react';
import {
  Form,
  Input,
  Modal,
  Row,
  Col,
  Upload,
  Icon,
  message,
  DatePicker,
  Select,
  Switch,
} from 'antd';
import moment from 'moment';
import { dateFormat } from '@/utils/localParams';
import { phoneCode } from '../utils';
import { uploadFeatureImage } from '../service';
import './style.less';

const FormItem = Form.Item;

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

const FormUser = props => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [confirmDirty, setConfirmDirty] = useState('');
  const { modalVisible, form, onSubmit: handleAdd, onCancel, values } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => {
        form.resetFields();
        setImageUrl('');
      });
    });
  };
  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, url => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const url = await uploadFeatureImage(file);
      onSuccess(url);
      setImageUrl(url);
    } catch (error) {
      onError(error);
    }
  };

  const prefixSelector = form.getFieldDecorator('phonePrefix', {
    initialValue: '+855',
  })(
    <Select style={{ width: 70 }}>
      {phoneCode.map(code => (
        <Select.Option key={`code-${code.dial_code}`} value={code.dial_code}>
          {code.dial_code}
        </Select.Option>
      ))}
    </Select>,
  );

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  const handleConfirmBlur = e => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  };

  const renderAvatar = () => {
    let avatar = '';
    if (values.avatar) {
      avatar = <img src={values.avatar} alt="avatar" style={{ width: '100%' }} />;
    } else if (imageUrl) {
      avatar = <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />;
    } else {
      avatar = uploadButton;
    }
    return avatar;
  };

  return (
    <Modal
      destroyOnClose
      title={Object.keys(values).length ? 'Update User' : 'New User'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <FormItem label="Avatar">
            {form.getFieldDecorator('avatar', {
              rules: [],
            })(
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={handleChange}
                customRequest={customRequest}
                style={{ width: '100%' }}
              >
                {renderAvatar()}
              </Upload>,
            )}
          </FormItem>
        </Col>
        <Col span={18}>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <FormItem label="First Name">
                {form.getFieldDecorator('firstName', {
                  initialValue: values.firstName ? values.firstName : '',
                  rules: [
                    {
                      required: true,
                      message: 'Please enter first name',
                    },
                  ],
                })(<Input placeholder="First Name" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="Last Name">
                {form.getFieldDecorator('lastName', {
                  initialValue: values.lastName ? values.lastName : '',
                  rules: [
                    {
                      required: true,
                      message: 'Please enter last name',
                    },
                  ],
                })(<Input placeholder="Last Name" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="Date of Birth">
                {form.getFieldDecorator('dob', {
                  initialValue: values.dob
                    ? moment(moment(values.dob).format(), dateFormat)
                    : moment(moment(new Date()).format(), dateFormat),
                  rules: [
                    {
                      required: true,
                      message: 'Please enter date of birth',
                    },
                  ],
                })(
                  <DatePicker
                    format={dateFormat}
                    placeholder="Date of birth"
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="User Authorization">
                {form.getFieldDecorator('isBackOfficeUser', {
                  initialValue: values.isBackOfficeUser ? values.isBackOfficeUser : false,
                  rules: [
                    {
                      required: true,
                      message: 'Please enter User Authorization',
                    },
                  ],
                })(
                  <Select placeholder="User Authorization" style={{ width: '100%' }}>
                    <Select.Option value={true}>BackOffice User</Select.Option>
                    <Select.Option value={false}>Guest User</Select.Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <FormItem label="Email">
                {form.getFieldDecorator('email', {
                  initialValue: values.email ? values.email : '',
                  rules: [
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                    {
                      required: true,
                      message: 'Please enter email',
                    },
                  ],
                })(<Input placeholder="Email" disabled={Object.keys(values).length} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="Phone Number" style={{ paddingTop: 4 }}>
                {form.getFieldDecorator('phone', {
                  initialValue: values.phone ? values.phone : '',
                  rules: [{ required: true, message: 'Please input your phone number!' }],
                })(
                  <Input
                    addonBefore={prefixSelector}
                    type="number"
                    step={1}
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="Password">
                {form.getFieldDecorator('password', {
                  rules: [
                    {
                      required: !Object.keys(values).length,
                      message: 'Please input your password!',
                    },
                  ],
                })(<Input.Password />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="Confirm Password">
                {form.getFieldDecorator('confirmPassword', {
                  rules: [
                    {
                      required: !Object.keys(values).length,
                      message: 'Please input your confirm password!',
                    },
                    {
                      validator: compareToFirstPassword,
                    },
                  ],
                })(<Input.Password onBlur={handleConfirmBlur} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="Status">
                {form.getFieldDecorator('status', {
                  valuePropName: 'checked',
                  rules: [],
                  initialValue: values.status ? values.status : false,
                })(<Switch checkedChildren="Active" unCheckedChildren="Inactive" />)}
              </FormItem>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

FormUser.defaultProps = {
  values: {},
};

export default Form.create()(FormUser);
