import React, { useState } from 'react';
import {
    Card,
    CardTitle,
    CardBody,
    Button,
    InputGroup,
    InputGroupText,
    InputGroupAddon,
    FormInput
} from "shards-react";

import axios from 'axios';

export default (props) => {

    const [tokens, setTokens] = useState("");
    const [availableTokens, setAvailableTokens] = useState(props.data.nTokens);

    const buyTokens = async () => {
        try {
            await axios.post('http://localhost:3001/tokens',
                {
                    businessKey: props.data.businessKey,
                    requestCorrelationId: props.data.requestCorrelationId,
                    quantity: tokens,
                    buyer: "Test User",
                    assetId: props.data._id
                }
            );
            setAvailableTokens(availableTokens - tokens);
            alert('Purchased tokens correctly');
        } catch (err) {
            alert('Error processing request');
        }

    }

    return (
        <Card style={{ maxWidth: "35vw", minWidth: "300px", margin: "50px auto" }}>
            <CardBody>
                <CardTitle>{props.data.assetName}</CardTitle>
                <p>Token price: {props.data.tokenPrice} €</p>
                {availableTokens > 0 ? <p>Available tokens: {availableTokens}</p> : <p>Asset Fully funded</p>}
                <InputGroup className="mb-2">
                    <InputGroupAddon type="prepend">
                        <InputGroupText>Tokens</InputGroupText>
                    </InputGroupAddon>
                    <FormInput placeholder="Number of tokens to buy" type="number" value={tokens} onChange={(e) => setTokens(e.target.value)} />
                </InputGroup>
                <Button onClick={buyTokens} disabled={tokens === null || tokens === undefined || tokens === "" || tokens <= 0 || tokens > availableTokens}>Buy tokens &rarr;</Button>

            </CardBody>
        </Card>
    )
}