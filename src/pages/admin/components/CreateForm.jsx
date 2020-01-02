import React from 'react';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;

const CreateForm = props => {
  const { modalVisible, form, onSubmit: handleAdd, onCancel } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="New rule"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Description">
        {form.getFieldDecorator('desc', {
          rules: [
            {
              required: true,
              message: 'Please enter a rule description of at least five characters!',
              min: 5,
            },
          ],
        })(<Input placeholder="Please enter" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(CreateForm);
