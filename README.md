# everse-esi
Enterprise Software Infrastructures Project for University of Camerino

# Instructions
First install nodejs dependencies inside every project folder except the camunda one.
You need an Infura API key and insert it into a .env file inside blockchain-gateway together with your ethereum wallet mnemonic like this:
INFURA_ENDPOINT="https://rinkeby.infura.io/v3/id"
MNEMONIC="your wallet mnemonic"

Then you can start everything first by running the camunda project and then by running "npm start" in the top folder as it automatically starts all the nodejs components.
