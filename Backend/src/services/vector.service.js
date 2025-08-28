// Import the Pinecone library
const { Pinecone } = require('@pinecone-database/pinecone')

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const ChatGptIndex = pc.Index('chat-gpt-1')

async function createMomory({vectors, metadata , messageId}){
    await ChatGptIndex.upsert([{
        id:messageId,
        values:vectors,
        metadata
    }])
}

async function queryMemory({queryVectors, limit = 5 , metadata}){
     const data = await ChatGptIndex.query({
         vector: queryVectors,
         topK: limit,
         filter: metadata ?  metadata : undefined,
         includeMetadata:true
     })

     return data.matches
}


module.exports={
    createMomory,
    queryMemory
}