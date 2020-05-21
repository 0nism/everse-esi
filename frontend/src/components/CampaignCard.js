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

export default (props) => {

    const [tokens, setTokens] = useState("");

    const buyTokens = async () => {
        alert(tokens);
    }

    return (
        <Card style={{ maxWidth: "35vw", minWidth: "300px", margin: "50px auto" }}>
            <CardBody>
                <CardTitle>{props.data.assetName}</CardTitle>
                <p>Token price: {props.data.tokenPrice} €</p>
                <p>Available tokens: {props.data.nTokens}</p>
                <InputGroup className="mb-2">
                    <InputGroupAddon type="prepend">
                        <InputGroupText>Tokens</InputGroupText>
                    </InputGroupAddon>
                    <FormInput placeholder="Number of tokens to buy" type="number" value={tokens} onChange={(e) => setTokens(e.target.value)} />
                </InputGroup>
                <Button onClick={buyTokens} disabled={tokens === null || tokens === undefined || tokens === "" || tokens < 0 || tokens > props.data.nTokens}>Buy tokens &rarr;</Button>

            </CardBody>
        </Card>
    )
}