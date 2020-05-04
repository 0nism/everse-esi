const { createMessageSendHandler } = require('./createMessageSendListener');

createMessageSendHandler('Service_Message_FundingRequestReceived', 'Message_FundingRequestReceived', ['amount']);