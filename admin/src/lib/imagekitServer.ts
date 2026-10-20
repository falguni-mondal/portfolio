// admin/src/lib/imagekitServer.ts
export async function deleteImageKitFiles(fileIds: string[]) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey || !fileIds || fileIds.length === 0) return;

  const cleanIds = Array.from(new Set(fileIds.filter((id) => Boolean(id && id.trim()))));
  if (cleanIds.length === 0) return;

  const basicAuth = Buffer.from(`${privateKey}:`).toString('base64');

  await Promise.allSettled(
    cleanIds.map((fileId) =>
      fetch(`https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
      })
    )
  );
}