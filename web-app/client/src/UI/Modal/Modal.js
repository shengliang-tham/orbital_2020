import React from 'react'
import { Modal } from 'antd';

const CustomModal = (props) => {
    return (
        <div>
            <Modal
                title={props.title}
                visible={props.visible}
                onCancel={props.handleCancel}
                destroyOnClose={true}
                okButtonProps={{
                    form: props.formName,
                    key: 'submit',
                    htmlType: 'submit',
                    disabled: props.disabledOk ? true : false
                }}
                cancelButtonProps={{
                    disabled: props.disabledCancel ? true : false
                }}
                maskClosable={false}
            >
                {props.children}
            </Modal>
        </div>
    )
}

export default CustomModal;
