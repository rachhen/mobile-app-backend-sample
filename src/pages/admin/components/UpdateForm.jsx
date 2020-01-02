import React, { Component } from 'react';
import { Button, DatePicker, Form, Input, Modal, Radio, Select, Steps } from 'antd';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

class UpdateForm extends Component {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        desc: props.values.desc,
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    };
  }

  handleNext = currentStep => {
    const { form, onSubmit: handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        },
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep, formVals) => {
    const { form } = this.props;
    if (currentStep === 1) {
      return [
        <FormItem key="target" {...this.formLayout} label="Monitoring object">
          {form.getFieldDecorator('target', {
            initialValue: formVals.target,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">Table I</Option>
              <Option value="1">Table II</Option>
            </Select>,
          )}
        </FormItem>,
        <FormItem key="template" {...this.formLayout} label="Rule template">
          {form.getFieldDecorator('template', {
            initialValue: formVals.template,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">Rule template one</Option>
              <Option value="1">Rule template two</Option>
            </Select>,
          )}
        </FormItem>,
        <FormItem key="type" {...this.formLayout} label="Rule type">
          {form.getFieldDecorator('type', {
            initialValue: formVals.type,
          })(
            <RadioGroup>
              <Radio value="0">Strong</Radio>
              <Radio value="1">weak</Radio>
            </RadioGroup>,
          )}
        </FormItem>,
      ];
    }
    if (currentStep === 2) {
      return [
        <FormItem key="time" {...this.formLayout} label="Starting time">
          {form.getFieldDecorator('time', {
            rules: [{ required: true, message: 'Please select a start time!' }],
          })(
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="Select start time"
            />,
          )}
        </FormItem>,
        <FormItem key="frequency" {...this.formLayout} label="Scheduling cycle">
          {form.getFieldDecorator('frequency', {
            initialValue: formVals.frequency,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="month">month</Option>
              <Option value="week">week</Option>
            </Select>,
          )}
        </FormItem>,
      ];
    }
    return [
      <FormItem key="name" {...this.formLayout} label="Rule name">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: 'Please enter a rule name!' }],
          initialValue: formVals.name,
        })(<Input placeholder="please enter" />)}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="Rule description">
        {form.getFieldDecorator('desc', {
          rules: [
            {
              required: true,
              message: 'Please enter a rule description of at least five characters!',
              min: 5,
            },
          ],
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="Please enter at least five characters" />)}
      </FormItem>,
    ];
  };

  renderFooter = currentStep => {
    const { onCancel: handleUpdateModalVisible, values } = this.props;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          Previous
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          cancel
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          Next step
        </Button>,
      ];
    }
    if (currentStep === 2) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          Previous
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          carry out
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        cancel
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        Next step
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, onCancel: handleUpdateModalVisible, values } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="Rule configuration"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="Basic Information" />
          <Step title="Configure rule properties" />
          <Step title="Set the scheduling period" />
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

export default Form.create()(UpdateForm);
