import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from
    "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand
} from "@aws-sdk/lib-dynamodb";
import awsConfig from '../aws/config';

const client = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'MultiStepForms';
// Create a named class
class DynamoDBService {
    constructor() {
        this.tableExists = false;
        this.init();
    }
    async init() {
        await this.checkAndCreateTable();
    }
    async checkAndCreateTable() {
        try {
            // Check if table exists using the main DynamoDB client
            await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
            this.tableExists = true;
            console.log('✅DynamoDB table exists');
        } catch (error) {
            if (error.name === 'ResourceNotFoundException') {
                console.log(' Table does not exist. Creating table...');
                await this.createTable();
            } else {
                console.error('❌Error checking table:', error);
            }
        }
    }
    async createTable() {
        const params = {
            TableName: TABLE_NAME,
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
            this.tableExists = true;
            console.log('✅DynamoDB table created successfully');
            // Wait for table to be active
            await this.waitForTableActive();
            return true;
        } catch (error) {
            if (error.name === 'ResourceInUseException') {
                console.log('✅Table already exists');
                this.tableExists = true;
                return true;
            } else {
                console.error('❌Error creating table:', error);
                return false;
            }
        }
    }
    async waitForTableActive() {
        const maxAttempts = 10;
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const data = await client.send(new DescribeTableCommand({
                    TableName:
                        TABLE_NAME
                }));
                if (data.Table.TableStatus === 'ACTIVE') {
                    console.log('✅Table is now active');
                    return true;
                }
                console.log(`⏳Waiting for table to be active... (${i + 1}/${maxAttempts})`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            } catch (error) {
                console.error('Error checking table status:', error);
                return false;
            }
        }
        console.error('❌Table did not become active in time');
        return false;
    }
    async ensureTableExists() {
        if (!this.tableExists) {
            await this.checkAndCreateTable();
        }
        return this.tableExists;
    }
    async createForm(formData) {
        if (!await this.ensureTableExists()) {
            throw new Error('DynamoDB table is not available');
        }
        const formId = `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const params = {
            TableName: TABLE_NAME,
            Item: {
                formId,
                formData: JSON.stringify(formData.formData || {}),
                currentStep: formData.currentStep || 1,
                title: formData.title || 'Untitled Form',
                status: formData.status || 'draft',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };
        try {
            await docClient.send(new PutCommand(params));
            console.log('✅Form created in DynamoDB:', formId);
            return { ...params.Item, formId };
        } catch (error) {
            console.error('❌Error creating form in DynamoDB:', error);
            throw new Error(`Failed to create form: ${error.message}`);
        }
    }
    async getForm(formId) {
        if (!await this.ensureTableExists()) {
            return null;
        }
        const params = {
            TableName: TABLE_NAME,
            Key: { formId },
        };
        try {
            const data = await docClient.send(new GetCommand(params));
            if (data.Item) {
                return {
                    ...data.Item,
                    formData: JSON.parse(data.Item.formData)
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching form from DynamoDB:', error);
            return null;
        }
    }
    async getAllForms(limit = 50) {
        if (!await this.ensureTableExists()) {
            return { forms: [], count: 0 };
        }
        const params = {
            TableName: TABLE_NAME,
            Limit: limit,
        };
        try {
            const data = await docClient.send(new ScanCommand(params));
            const forms = data.Items ? data.Items.map(item => ({
                ...item,
                formData: JSON.parse(item.formData)
            })) : [];
            return {
                forms,
                count: data.Count || 0
            };
        } catch (error) {
            console.error('Error fetching all forms from DynamoDB:', error);
            return { forms: [], count: 0 };
        }
    }
    async searchForms(searchTerm, status = null) {
        if (!await this.ensureTableExists()) {
            return [];
        }
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: 'contains(#title, :search)',
            ExpressionAttributeNames: {
                '#title': 'title',
            },
            ExpressionAttributeValues: {
                ':search': searchTerm,
            },
        };
        if (status && status !== 'all') {
            params.FilterExpression += ' AND #status = :status';
            params.ExpressionAttributeNames['#status'] = 'status';
            params.ExpressionAttributeValues[':status'] = status;
        }
        try {
            const data = await docClient.send(new ScanCommand(params));
            const forms = data.Items ? data.Items.map(item => ({
                ...item,
                formData: JSON.parse(item.formData)
            })) : [];
            return forms;
        } catch (error) {
            console.error('Error searching forms in DynamoDB:', error);
            return [];
        }
    }
    async updateForm(formId, updates) {
        if (!await this.ensureTableExists()) {
            throw new Error('DynamoDB table is not available');
        }
        let updateExpression = 'SET #updatedAt = :updatedAt';
        const expressionAttributeNames = {
            '#updatedAt': 'updatedAt',
        };
        const expressionAttributeValues = {
            ':updatedAt': new Date().toISOString(),
        };
        if (updates.formData !== undefined) {
            updateExpression += ', #formData = :formData';
            expressionAttributeNames['#formData'] = 'formData';
            expressionAttributeValues[':formData'] = JSON.stringify(updates.formData);
        }
        if (updates.currentStep !== undefined) {
            updateExpression += ', #currentStep = :currentStep';
            expressionAttributeNames['#currentStep'] = 'currentStep';
            expressionAttributeValues[':currentStep'] = updates.currentStep;
        }
        if (updates.title !== undefined) {
            updateExpression += ', #title = :title';
            expressionAttributeNames['#title'] = 'title';
            expressionAttributeValues[':title'] = updates.title;
        }
        if (updates.status !== undefined) {
            updateExpression += ', #status = :status';
            expressionAttributeNames['#status'] = 'status';
            expressionAttributeValues[':status'] = updates.status;
        }
        const params = {
            TableName: TABLE_NAME,
            Key: { formId },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        };
        try {
            const data = await docClient.send(new UpdateCommand(params));
            console.log('Form updated in DynamoDB:', formId);
            return data.Attributes;
        } catch (error) {
            console.error('Error updating form in DynamoDB:', error);
            throw error;
        }
    }
    async deleteForm(formId) {
        if (!await this.ensureTableExists()) {
            throw new Error('DynamoDB table is not available');
        }
        const params = {
            TableName: TABLE_NAME,
            Key: { formId },
        };
        try {
            await docClient.send(new DeleteCommand(params));
            console.log('Form deleted from DynamoDB:', formId);
            return true;
        } catch (error) {
            console.error('Error deleting form from DynamoDB:', error);
            throw error;
        }
    }
}
// Create instance and export it
const dynamoDBService = new DynamoDBService();
export default dynamoDBService;