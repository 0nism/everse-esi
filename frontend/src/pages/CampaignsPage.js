import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { css } from "@emotion/core";
import CircleLoader from "react-spinners/CircleLoader";

import {
    Card,
    CardTitle,
    CardBody,
    Button
} from "shards-react";

const override = css`
  display: block;
  margin: 50px auto;
  border-color: #467BFF;
`;

export default () => {

    const [loading, setLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
            setLoading(true);
            try {
                const results = await axios.get('http://localhost:3001/assets');
                setCampaigns(results.data);
            } catch (err) {
                console.log(err);
            }

            setLoading(false);
        }

        fetchCampaigns();

    }, []);

    const renderCampaignCard = (campaignData) => {
        return (
            <Card style={{ maxWidth: "35vw", minWidth: "300px", margin: "50px auto" }}>
                <CardBody>
                    <CardTitle>{campaignData.assetName}</CardTitle>
                    <p>Token price: {campaignData.tokenPrice} €</p>
                    <p>Available tokens: {campaignData.nTokens}</p>
                    <Button>Buy tokens &rarr;</Button>
                </CardBody>
            </Card>
        )
    }

    return (
        <>
            <CircleLoader
                css={override}
                size={150}
                color={"#123abc"}
                loading={loading}
            />
            {
                !loading ? campaigns.map((campaignData) => renderCampaignCard(campaignData)) : null
            }

        </>
    );
}