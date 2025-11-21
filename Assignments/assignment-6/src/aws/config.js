const awsConfig = {
    region: process.env.REACT_APP_AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
};
export default awsConfig;