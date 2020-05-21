import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { css } from "@emotion/core";
import CircleLoader from "react-spinners/CircleLoader";

import CampaignCard from "./../components/CampaignCard";

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

    return (
        <>
            <CircleLoader
                css={override}
                size={150}
                color={"#123abc"}
                loading={loading}
            />
            {
                !loading ? campaigns.map((campaignData) => <CampaignCard data={campaignData} key={campaignData._id} />) : null
            }

        </>
    );
}