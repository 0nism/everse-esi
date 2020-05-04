const { createMessageSendHandler } = require('./createMessageSendListener');

createMessageSendHandler('Service_Message_FundingRequestReceived', 'Message_FundingRequestReceived', ['amount', 'requestCorrelationId']);
createMessageSendHandler('Service_Message_AcceptedRequest', 'Message_AcceptedRequest', [], ['requestCorrelationId']);
createMessageSendHandler('Service_Message_RefusedRequest', 'Message_RefusedRequest', [], ['requestCorrelationId']);