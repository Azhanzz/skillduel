const axios = require('axios');

const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
};

const headers = {
  'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
  'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
  'Content-Type': 'application/json',
};

module.exports = { LANGUAGE_IDS, headers };

async function runCode(sourceCode, language, stdin){
    const languageId = LANGUAGE_IDS[language];

    const submitResponse = await axios.post(
        `${process.env.JUDGE0_URL}/submissions?base64_encoded=true&wait=true`,
        {
            source_code: Buffer.from(sourceCode).toString('base64'),
            language_id: languageId,
            stdin: Buffer.from(stdin).toString('base64'),
        },
        { headers }
    );
    const token = submitResponse.data.token;

    const resultResponse = await axios.get(
        `${process.env.JUDGE0_URL}/submissions/${token}?base64_encoded=true`,
        { headers }
    );
    
    return resultResponse.data;

}
module.exports = {LANGUAGE_IDS, headers, runCode};