import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { auth } from '@/lib/auth'

const ALLOWED_TYPES = ['selfie', 'address_proof', 'pcc'] as const
type UploadType = (typeof ALLOWED_TYPES)[number]

const CONTENT_TYPES: Record<UploadType, string> = {
  selfie: 'image/jpeg',
  address_proof: 'application/octet-stream',
  pcc: 'application/octet-stream',
}

function getS3Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials not configured')
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const rawType = searchParams.get('type')

  if (!rawType || !(ALLOWED_TYPES as readonly string[]).includes(rawType)) {
    return NextResponse.json(
      { error: `Invalid type. Must be one of: ${ALLOWED_TYPES.join(', ')}` },
      { status: 400 }
    )
  }

  const uploadType = rawType as UploadType
  const bucketName = process.env.R2_BUCKET_NAME
  const publicBaseUrl = process.env.R2_PUBLIC_URL

  if (!bucketName || !publicBaseUrl) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 500 })
  }

  const timestamp = Date.now()
  const userId = session.user.id
  const key = `${uploadType}/${userId}/${timestamp}`

  try {
    const client = getS3Client()

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: CONTENT_TYPES[uploadType],
    })

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 })

    const publicUrl = `${publicBaseUrl.replace(/\/$/, '')}/${key}`

    return NextResponse.json({ uploadUrl, publicUrl })
  } catch (err) {
    console.error('[upload/signed-url] error:', err)
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
  }
}
