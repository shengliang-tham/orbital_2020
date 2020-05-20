import React from 'react'
import { Modal, Button } from 'antd';

const CustomModal = (props) => {
    return (
        <div>
            <Modal
                title={props.title}
                visible={props.visible}
                onCancel={props.handleCancel}
                destroyOnClose={true}
                okButtonProps={{ form: props.formName, key: 'submit', htmlType: 'submit' }}
            >
                {props.children}
            </Modal>
        </div>
    )
}

export default CustomModal;
