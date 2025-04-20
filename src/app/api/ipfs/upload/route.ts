import { NextRequest, NextResponse } from 'next/server'
import { create } from 'ipfs-http-client'

// Initialize IPFS client
const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: `Basic ${Buffer.from(
            `${process.env.BANKNBOOK_API_KEY}:${process.env.BANKNBOOK_API_SECRET}`
        ).toString('base64')}`,
    },
})

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Convert file to array buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Add file to IPFS
        const { cid } = await ipfs.add(buffer)

        // Return the IPFS URL
        return NextResponse.json({
            url: `https://ipfs.io/ipfs/${cid.toString()}`
        })
    } catch (error) {
        console.error('Error uploading to IPFS:', error)
        return NextResponse.json(
            { error: 'Failed to upload file to IPFS' },
            { status: 500 }
        )
    }
} 