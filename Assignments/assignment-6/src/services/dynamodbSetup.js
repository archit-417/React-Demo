import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import awsConfig from '../aws/config';
const client = new DynamoDBClient(awsConfig);
export const createTableIfNotExists = async () => {
    const params = {
        TableName: 'MultiStepFormsArchit',
        AttributeDefinitions: [
            {
                AttributeName: 'formId',
                AttributeType: 'S'
            }
        ],
        KeySchema: [
            {
                AttributeName: 'formId',
                KeyType: 'HASH'
            }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    };
    try {
        await client.send(new CreateTableCommand(params));
        console.log('DynamoDB table created successfully');
        return true;
    } catch (error) {
        if (error.name === 'ResourceInUseException') {
            console.log('DynamoDB table already exists');
            return true;
        } else {
            console.error('Error creating table:', error);
            return false;
        }
    }
};