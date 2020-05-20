import React, { useState } from 'react';
import { Form, FormInput, FormGroup, Button, Modal, ModalBody, ModalHeader } from "shards-react";
import axios from 'axios';

export default () => {

    const [amount, setAmount] = useState(0);
    const [assetName, setAssetName] = useState("");

    const [open, setOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");

    const toggle = () => setOpen(!open);

    return (
        <div style={{ maxWidth: "60%", margin: "32px auto" }}>
            <Form>
                <FormGroup>
                    <label htmlFor="#username">Amount</label>
                    <FormInput onChange={(e) => setAmount(e.target.value)} value={amount} type="number" id="#username" placeholder="Amount" />
                </FormGroup>
                <FormGroup>
                    <label htmlFor="#assetName">Asset name</label>
                    <FormInput onChange={(e) => setAssetName(e.target.value)} value={assetName} id="#assetName" placeholder="Asset name" />
                </FormGroup>
                <Button onClick={async () => {
                    try {
                        await axios.post('http://localhost:3001/request', {
                            amount,
                            assetName
                        });

                        setModalTitle('Success');
                        setModalText('✅ We received your request correctly');

                    } catch (error) {
                        setModalTitle('Failed');
                        setModalText('❌ We couldn\'t process your request');
                    }

                    toggle();
                }}>Send Request</Button>
            </Form>

            <Modal size="sm" open={open} toggle={toggle}>
                <ModalHeader>{modalTitle}</ModalHeader>
                <ModalBody>{modalText}</ModalBody>
            </Modal>
        </div>
    );
}