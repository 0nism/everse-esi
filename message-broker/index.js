const { createMessageSendHandler } = require('./createMessageSendListener');

createMessageSendHandler('Service_Message_FundingRequestReceived', 'Message_FundingRequestReceived', ['amount', 'requestCorrelationId', 'assetName']);
createMessageSendHandler('Service_Message_AcceptedRequest', 'Message_AcceptedRequest', [], ['requestCorrelationId']);
createMessageSendHandler('Service_Message_RefusedRequest', 'Message_RefusedRequest', [], ['requestCorrelationId']);
createMessageSendHandler('Service_Message_CampaignSucceeded', 'Message_CampaignSucceeded', [], ['requestCorrelationId']);
createMessageSendHandler('Service_Message_CampaignFailed', 'Message_CampaignFailed', [], ['requestCorrelationId']);