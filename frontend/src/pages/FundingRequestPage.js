import React, { useState } from 'react';
import { Form, FormInput, FormGroup, Button } from "shards-react";
import axios from 'axios';

export default () => {

    const [amount, setAmount] = useState(0);
    const [assetName, setAssetName] = useState("");

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

                        // TODO handle success
                    } catch (err) {
                        //TODO handle error
                    }

                }}>Send Request</Button>
            </Form>
        </div>
    );
}